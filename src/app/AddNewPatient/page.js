'use client';
import { useState, useEffect } from "react";
import  databaseFunctions from "../../lib/data.js";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, database } from '../../lib/firebase.js'; 
import { useAuth } from "../../context/AuthContext.js";
import { doc } from "firebase/firestore";

export default function Page() {
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        injury: '',
        doctorId: '',
    });
    const [error, setError] = useState(null);

    const doctor = useAuth();

    useEffect(() => {
        if (doctor) {
            setInputs(inputs => ({...inputs, doctorId: doctor.uid}));
        }
    }, [doctor]);
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Update only the doctorId field within the inputs state
        const updatedInputs = {...inputs, doctorId: doctor.uid};
    
        try {
            console.log('trying to send patient data');
            const response = await fetch('http://localhost:3001/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedInputs), // Use the updated inputs with the doctorId
            });
            const result = await response.json();
            console.log('Patient created:', result);
            // Reset form or give user feedback
        } catch (error) {
            console.error('Error creating patient:', error);
        }
    }
    

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        //i should do some error checking here for strings and for confirming valid emails
        setInputs(values => ({...values, [name]: value}))
      }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-center mb-4">Add New Patient</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full sm:w-1/2 mb-4 sm:mb-0 pr-2">
                        <label className="block mb-2">Patient First Name:</label>
                        <input type="text" name="firstName" value={inputs.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div className="w-full sm:w-1/2 pl-2">
                        <label className="block mb-2">Patient Last Name:</label>
                        <input type="text" name="lastName" value={inputs.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                </div>
                <div className="flex flex-wrap justify-between">
                    <div className="w-full sm:w-1/2 mb-4 sm:mb-0 pr-2">
                        <label className="block mb-2">Patient Email:</label>
                        <input type="text" name="email" value={inputs.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div className="w-full sm:w-1/2 pl-2">
                        <label className="block mb-2">Patient Phone Number:</label>
                        <input type="text" name="phoneNumber" value={inputs.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                </div>
                <div className="w-full mb-4">
                    <label className="block mb-2">Patient Address:</label>
                    <input type="text" name="address" value={inputs.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                </div>
                <div className="w-full mb-4">
                    <label className="block mb-2">Patient Injury Type:</label>
                    <input type="text" name="injury" value={inputs.injury} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Submit</button>
            </form>
        </div>
    
    );
  }