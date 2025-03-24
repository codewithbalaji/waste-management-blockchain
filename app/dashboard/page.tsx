"use client";
import { useState, useEffect } from "react";
import { getContract } from "@/lib/web3";

export default function Dashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function loadReports() {
      const contract = await getContract();
      if (contract) {
        const reportCount = await contract.reportCount();
        let reportList = [];
        for (let i = 1; i <= reportCount; i++) {
          const report = await contract.reports(i);
          reportList.push({
            id: report.id.toString(),
            image: report.imageHash, // Cloudinary URL
            location: report.location,
            description: report.description,
            completed: report.completed,
          });
        }
        setReports(reportList);
      }
    }
    loadReports();
  }, []);

  const markAsCompleted = async (id: string) => {
    const contract = await getContract();
    if (contract) {
      const tx = await contract.completeReport(id);
      await tx.wait();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Illegal Dumping Reports</h1>
      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report.id} className="p-4 border rounded">
            <img src={report.image} alt="Dumping" className="w-full h-40 object-cover" />
            <p>{report.description}</p>
            <p>📍 {report.location}</p>
            <button onClick={() => markAsCompleted(report.id)} className="bg-green-500 text-white p-1 rounded">
              {report.completed ? "Completed" : "Mark as Completed"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
