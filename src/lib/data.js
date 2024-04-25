import { database, auth } from './firebase.js';
import { collection, getDoc, doc, getDocs, query, where, orderBy, limit, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { formatDate, getDate } from './dateUtils.js';


          const doctorRef = doc(database, 'doctors', doctorID);
