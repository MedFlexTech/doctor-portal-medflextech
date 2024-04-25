'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import databaseFunctions from '../../../lib/data.js'; 
import { formatDate } from '../../../lib/dateUtils.js';
import CreateTreatmentButton from '../../../lib/components/CreateTreatment.js';

const UserPage = () => {
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    
    useEffect(() => {
        // Parse query parameters from the URL
        const queryParams = new URLSearchParams(window.location.search);
        const userIdParam = queryParams.get('userId');
        console.log(userIdParam);
        if (userIdParam) {
            setUserId(userIdParam);
        }
    }, []);

    useEffect(() => {
        //console.log(userId);
        if (userId) { // Make sure the userId is defined
            databaseFunctions.fetchUserData(userId).then(setUserData);
        }
    }, [userId]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-center mb-4">Patient Report</h1>
            <h2 className="text-center">{userData.name}</h2>
            <div className="mt-8">
                <div className="border border-blue-500 rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Information</h3>
                    <p>Injury: {userData.injury}</p>
                </div>
            </div>
            <div className="mt-8">
                <div className="border border-blue-500 rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Treatment Compliance</h3>
                    {/* Display treatment compliance information */}
                    <CreateTreatmentButton userId={userId} />
                </div>  
            </div>
            <div className="mt-8">
                <div className="border border-blue-500 rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Journals</h3>
                    <div className="flex overflow-x-auto">
                        {userData.journals.map(journal => (
                            <div key={journal.id} className="w-64 bg-white rounded-md shadow-md p-4 mr-4">
                                <p>Date: {formatDate(journal.createdAt)}</p>
                                <p>Pain Level: {journal.painLevel}</p>
                                <p>Overall Feeling: {journal.feeling}</p>
                                <p>Entry: {journal.comments}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;