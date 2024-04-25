/**
 * Formats a Firestore timestamp into a human-readable string.
 * @param {firebase.firestore.Timestamp} timestamp - Firestore timestamp to format.
 * @param {string} format - Desired format string.
 * @returns {string} Formatted date string.
 */


export function formatDate(timestamp, format = 'MM/DD/YYYY') {
    if (!timestamp) {
        return '';
    }

    // Convert Firestore Timestamp to JavaScript Date object
    const date = timestamp.toDate();

    // Using toLocaleDateString() for simplicity
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    });
}

export function getDate(timestamp){
    if (!timestamp) {
        return null;
    }
    return timestamp.toDate();
}

export function formatCalendarDate(date){
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0'); // Months are zero-indexed
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
}