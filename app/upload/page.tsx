"use client";

import { useState } from "react";
import Papa from "papaparse";

type Participant = {
  Name: string;
  Email: string;
};

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    Papa.parse<Participant>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        setParticipants(results.data);
      },

      error: (error) => {
        console.error("CSV okuma hatası:", error);
        setParticipants([]);
      },
    });
  };
  const filteredParticipants = participants.filter((person) => {
    const name = person.Name.toLowerCase();
    const email = person.Email.toLowerCase();
    const search = searchTerm.toLowerCase();
  
    return name.includes(search) || email.includes(search);
  });

  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        CSV Upload
      </h1>

      <input
        id="csv-file"
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="hidden"
      />

      <label
        htmlFor="csv-file"
        className="inline-block cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        CSV Dosyası Seç
      </label>

      {fileName && (
        <p className="mt-4 text-green-600">
          📄 {fileName}
        </p>
      )}

      {participants.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Katılımcılar ({participants.length})
          </h2>
          <input
  type="text"
  placeholder="Katılımcı ara..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
  className="mb-4 w-full rounded-lg border border-gray-300 p-3 text-black"
/>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">
                    Ad
                  </th>

                  <th className="border border-gray-300 p-3 text-left">
                    E-posta
                  </th>
                </tr>
              </thead>

              <tbody>
              {filteredParticipants.map((person, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-3">
                      {person.Name}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {person.Email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}