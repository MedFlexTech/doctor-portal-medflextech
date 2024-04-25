import { database, auth } from './firebase.js';
import { collection, getDoc, doc, getDocs, query, where, orderBy, limit, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { formatDate, getDate } from './dateUtils.js';


const databaseFunctions = {
    async getUsers(doctorID) {
        let users = [];
        try {
          // Get a reference to the current doctor document based on their UID
          const doctorRef = doc(database, 'doctors', doctorID);
          const doctorSnap = await getDoc(doctorRef);
    
          // Make sure the document exists and has the 'patients' field
          if (doctorSnap.exists() && doctorSnap.data().patients) {
            const patientIds = doctorSnap.data().patients; // This should be an array of patient UIDs
    
            for (const userId of patientIds) {
              const userRef = doc(database, 'users', userId);
              const userSnap = await getDoc(userRef);
    
              if (userSnap.exists()) {
                // Get the user data from the snapshot
                const userData = userSnap.data();
                console.log(userData);
    
                // Now we need to query the subcollection 'journals' for this specific user
                const journalsRef = collection(userRef, 'journals');
                const journalsQuery = query(journalsRef, where('read', '==', false));
                const journalsSnap = await getDocs(journalsQuery);

                const treatmentsRef = collection(userRef, 'treatments');
    
                // Get the last treatment date by ordering the journals by 'date' and limiting to 1
                const lastTreatmentQuery = query(treatmentsRef, orderBy('date', 'ascn'), limit(1));
                console.log(lastTreatmentQuery);
                const lastTreatmentSnap = await getDocs(lastTreatmentQuery);
                const lastTreatmentDate = lastTreatmentSnap.docs.length > 0 ? lastTreatmentSnap.docs[0].data().date : null;
                console.log(lastTreatmentDate);
                const formattedDate = formatDate(lastTreatmentDate);
                console.log("Last treatment date:", formattedDate);
    
                // Add the patient data, including whether there are unread journals
                users.push({
                  name: `${userData.firstName} ${userData.lastName}`,
                  injuryType: userData.injury,
                  unreadJournals: !journalsSnap.empty,
                  lastTreatmentDate: formattedDate,
                  userId: userSnap.id // Store the patient ID for navigation
                });
              }
            }
          }
        } catch (e) {
          console.error("Error fetching users: ", e);
          // Handle the error appropriately in your UI
        }
    
        // Return the constructed array of user data
        console.log(users);
        return users;
      },

      //this is broken and needs to be put on its own local server
    async createNewUser(email, firstName, lastName, injury, address, phoneNumber, doctorID){
        const temporaryPassword = 'TemporaryPassword123!';

        try {
            // Create a new user with the provided email and temporary password
            console.log("here");
            console.log(doctorID)
            const userCredential = await createUserWithEmailAndPassword(auth, email, temporaryPassword);
            console.log(userCredential);
        
            const userId = userCredential.user.uid;

            console.log(userId);
            await setDoc(doc(database, 'users', userId), {
            firstName,
            lastName,
            email,
            injury,
            address,
            phoneNumber,
            });

            // Send a password reset email to the user so they can set their own password
            //await sendPasswordResetEmail(auth, email);

            
            // Add the users id to the array of ids that the doctor has
            const doctorRef = doc(database, 'doctors', doctorID);

            await updateDoc(doctorRef, {
                patients: arrayUnion(userId)
            });

            return `${firstName} ${lastName} created successfully.`
        } catch (error) {
            console.error('Error creating new user:', error.code);
            throw error; 
        }

    },

    async fetchUserData(userId){
        try{
            const userRef = doc(database, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                // Get the user data from the snapshot
                const userData = userSnap.data();
                console.log(userData);
    
                // Now we need to query the subcollection 'journals' for this specific user
                const journalsRef = collection(userRef, 'journals');
                const journalsQuery = query(journalsRef, orderBy('createdAt', 'desc'), limit(10));
                const journalsSnap = await getDocs(journalsQuery);
                console.log(journalsSnap);
                console.log(journalsSnap.docs.length);
                //console.log(journalsSnap.docs[0].data());
                let journal = [];
                for(let i = 0; i < journalsSnap.docs.length; i++){
                    let journalData = journalsSnap.docs[i].data();
                    let journalId = journalsSnap.docs[i].id;
                    journal.push({ ...journalData, id: journalId });
                }
                console.log('journal:',journal);

                const treatmentsRef = collection(userRef, 'treatments');
    
                // Get the last treatment date by ordering the journals by 'date' and limiting to 1
                const lastTreatmentQuery = query(treatmentsRef, orderBy('date', 'ascn'), limit(1));
                console.log(lastTreatmentQuery);
                const lastTreatmentSnap = await getDocs(lastTreatmentQuery);
                const lastTreatmentDate = lastTreatmentSnap.docs.length > 0 ? lastTreatmentSnap.docs[0].data().date : null;
                console.log(lastTreatmentDate);
                const formattedDate = formatDate(lastTreatmentDate);
                console.log("Last treatment date:", formattedDate);

                let user = {
                    name: `${userData.firstName} ${userData.lastName}`,
                    injury: userData.injury,
                    lastTreatmentDate: formattedDate,
                    journals: journal,
                };
                console.log(user);
                return user;
            }
        }
        catch(e){
            console.error('Could not get user data: ', e);
        }
    },

    async calculateTreatmentCompliance(){

    },

    async getTreatments(userId){
        try{
            const userRef = doc(database, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                // Get the user data from the snapshot
                const userData = userSnap.data();
                console.log(userData);
    
                const treatmentsRef = collection(userRef, 'treatments');
    
                // Get all the treatments
                const treatmentSnap = await getDocs(treatmentsRef);
                
                let treatments = [];
                treatmentSnap.forEach(doc => { // Correct iteration over documents
                    const treatmentData = doc.data(); // Get the data from each document
                    let formattedDate = getDate(treatmentData.date); // 'date' is a Firestore Timestamp field
                    treatments.push(formattedDate); //Create treatment page handles formatting
                });
                
                console.log("Treatment Dates:", treatments);

                return treatments;
                
            }
        }
        catch(e){
            console.error('Could not get user data: ', e);
        }
    },

    async addTreatment({userId, dates, boneMinutes, muscleMinutes}){
        try{
            const userRef = doc(database, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                // Get the user data from the snapshot
                const userData = userSnap.data();
                console.log(userData);
    
                const treatmentsRef = collection(userRef, 'treatments');

                for(const date of dates){
                    const theDate = new Date(date);
                    theDate.setUTCHours(0, 0, 0, 0);
                    const timestamp = Timestamp.fromDate(theDate);
                    //see if treatment for that day exists
                    let treatmentQuery = await getDocs(query(treatmentsRef, where('date', '==', timestamp)))

                    if (!treatmentQuery.empty) {
                        // Document with this date exists, update the existing document
                        const treatmentDocRef = treatmentQuery.docs[0].ref; // Get the first matching document reference
                        await setDoc(treatmentDocRef, {
                            boneMinutes,
                            muscleMinutes,
                            date: timestamp,
                            completed: treatmentQuery.docs[0].data().completed // Keep the existing 'completed' status
                        }, { merge: true }); // Merge with existing data
                    } else {
                        // No document with this date exists, create a new one
                        // Generate a new document ID or use a predictable pattern
                        const newTreatmentDocRef = doc(treatmentsRef);
                        await setDoc(newTreatmentDocRef, {
                            boneMinutes,
                            muscleMinutes,
                            date: timestamp,
                            completed: false // Set default completed status
                        });
                    }

                }
                console.log("Treatment added")
                return true;
            }
            console.log("No user exists")
            return false;
        }
        catch(e){
            console.error("Error adding/updating treatment:", e);
        }
    }
}

export default databaseFunctions;