// src/app/(auth)/training/page.js
import db from "@/app/lib/server/db"; // Import db directly
//import Image from "next/image";

export default async function TrainingsPage() {
  // Query the database directly
  const trainings = db.prepare("SELECT * FROM trainings").all();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Trainings</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {trainings.map((training) => (
          <div
            key={training.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
           <img
            src={`/trainings/${training.image}`} // ✅ Updated
            alt={training.title}
            className="w-full h-48 object-cover"
              />

            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {training.title}
              </h2>
              <p className="text-gray-600 mt-2">{training.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
