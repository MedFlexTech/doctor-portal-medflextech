import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Calendar from 'react-calendar'; // You can replace with your preferred calendar library
import databaseFunctions from '../data.js'; // Function to get treatments from Firestore
import 'react-calendar/dist/Calendar.css';
import { formatCalendarDate } from '../dateUtils.js';

const CreateTreatmentButton = ({userId}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [boneMinutes, setBoneGrowthStim] = useState('');
    const [muscleMinutes, setmuscleMinutes] = useState('');
    const [disabledDays, setDisabledDays] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);

    // Fetch treatments for the user when the modal opens
    useEffect(() => {
        if (isModalOpen) {
            fetchTreatments();
        }
    }, [isModalOpen]);

    const fetchTreatments = async () => {
        // Fetch treatments for the user from Firestore
        const treatments = await databaseFunctions.getTreatments(userId);
        // Update selectedDays state to gray out these days on the calendar
        setDisabledDays(treatments);
    };

    const handleDayClick = (value) => {
        //console.log("Selected Date", value);
        const dateStr = formatCalendarDate(value); // Convert to YYYY-MM-DD format for easier comparison
       // console.log(dateStr);
        let newSelectedDates = [...selectedDates];
        if (selectedDates.includes(dateStr)) {
            // If the date is already selected, remove it
            newSelectedDates = newSelectedDates.filter(date => date !== dateStr);
        } else {
            // Otherwise, add the new date
            newSelectedDates.push(dateStr);
        }
        setSelectedDates(newSelectedDates);
    };


    const handleSubmit = async () => {
        if (selectedDays.length === 0 || parseInt(boneMinutes) < 0 || parseInt(muscleMinutes) < 0) {
            alert('Invalid input');
            return;
        }
        //add the treatment to the treatment collection
        let posted = await databaseFunctions.addTreatment({
            userId,
            dates: selectedDates,
            boneMinutes,
            muscleMinutes
        });

        if(posted){
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" onClick={() => setIsModalOpen(true)}>Create Treatment</button>
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <Calendar
                    onClickDay={handleDayClick}
                    value={selectedDays}
                    onChange={setSelectedDays}
                    tileClassName={({ date, view }) => {
                        if (view === 'month') {
                            // Check if the current tile's date is selected
                            const dateStr = formatCalendarDate(date);
                            if (selectedDates.includes(dateStr)) {
                                return 'react-calendar__tile--active'; // Apply a custom class for styling
                            }
                        }
                    }}
                    tileDisabled={({ date, view }) => {
                        // Debugging: Log the current date being processed
                        //console.log("Checking date:", date.getFullYear(), date.getMonth(), date.getDate());
                        if (view === 'month') {
                            // Check if any disabledDate matches the current date
                            const isDisabled = disabledDays.some(disabledDate => 
                                date.getFullYear() === disabledDate.getFullYear() &&
                                date.getMonth() === disabledDate.getMonth() &&
                                date.getDate() === disabledDate.getDate()
                            );
                            // Log whether the date is being disabled
                            //console.log("Is disabled:", isDisabled);
                            return isDisabled;
                        }
                        return false;
                    }    
                    }
                />
                <div>
                    Selected Dates: {selectedDates.join(', ')}
                </div>
                <input type="number" value={boneMinutes} onChange={(e) => setBoneGrowthStim(e.target.value)} placeholder="Bone Growth Stim (minutes)" />
                <input type="number" value={muscleMinutes} onChange={(e) => setmuscleMinutes(e.target.value)} placeholder="Muscle Stim (minutes)" />
                <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" onClick={handleSubmit}>Submit</button>
            </Modal>
        </div>
    );
};


export default CreateTreatmentButton;
