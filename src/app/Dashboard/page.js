'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, database } from '../../lib/firebase.js'; 
import { useAuth } from '../../context/AuthContext.js';
import Link from 'next/link.js';
import databaseFunctions from '../../lib/data.js'; 

const DashboardPage = () => {
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  const doctor = useAuth();

  useEffect(() => {
    // Only fetch patients if the user is signed in
    if (doctor) {
        console.log(doctor.uid);
      const fetchPatients = async () => {
        try {
          const usersData = await databaseFunctions.getUsers(doctor.uid); // Pass the user's UID
          console.log(usersData);
          setPatients(usersData);
        } catch (error) {
          console.error('Error loading patient data:', error);
          // Handle the error, possibly by setting an error state and displaying a message
        }
      };

      fetchPatients();
    }
  }, [doctor]);


  // Function to navigate to the patient details page
  const navigateToPatient = (userId) => {
    router.push(`/Patient/user?userId=${userId}`); // Adjust the path as necessary
  };
   //console.log(user.uid);

  return (
    <div className="dashboard">
      <h1 className="text-center">Patient Dashboard</h1>
      <div className="mr-4 mb-4 text-right">
        <Link href='/AddNewPatient' className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Add New Patient</Link>
      </div>
      <table className="mt-8 mx-auto border-collapse border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Injury</th>
            <th className="py-2 px-4 border">Journal Entries</th>
            <th className="py-2 px-4 border">Treatment Dates</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.userId} onClick={() => navigateToPatient(patient.userId)} className="cursor-pointer">
              <td className="py-2 px-4 border w-1/4 truncate">{patient.name}</td>
              <td className="py-2 px-4 border w-1/4 truncate">{patient.injuryType}</td>
              <td className={"py-2 px-4 border w-1/4 truncate " + (patient.unreadJournals ? 'text-orange-500' : '')}>{patient.unreadJournals ? 'Unread Entries' : 'All Read'}</td>
              <td className={"py-2 px-4 border w-1/4 truncate " + (patient.daysUntilTreatment < 5 ? 'text-red-500' : '')}>{patient.lastTreatmentDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPage;
