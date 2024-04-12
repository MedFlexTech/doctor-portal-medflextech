import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container">
        <section className="search-bar">
          <input type="text" placeholder="Search for a patient..." />
          <select>
            <option value="name">Sort By: Name</option>
            <option value="injury">Sort By: Injury</option>
          </select>
        </section>
        <section className="patient-list">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Injury</th>
                <th>Unread Journal Entries</th>
                <th>Treatment Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Femur Fracture</td>
                <td>Entries available for review...</td>
                <td>Scheduled until 4/10/24</td>
              </tr>
              <tr>
                <td>Jane Doe</td>
                <td>Tibia Fracture</td>
                <td>No new entries</td>
                <td>Scheduled until 4/6/24</td>
              </tr>
            </tbody>
          </table>
          <button>
          <Link href="/AddNewPatient">+ Add a new patient</Link>
            
          </button>
        </section>
    </div>
    </main>
  );
}
