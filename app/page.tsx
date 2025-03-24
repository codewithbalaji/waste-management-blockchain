"use client";
import { useState } from "react";
import { getContract, uploadToCloudinary } from "@/lib/web3";

export default function Report() {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submitReport = async () => {
    if (!image || !location || !description) return alert("All fields are required!");
    setLoading(true);

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(image);
    if (!imageUrl) {
      alert("Image upload failed!");
      setLoading(false);
      return;
    }

    // Submit report to blockchain
    const contract = await getContract();
    if (contract) {
      try {
        const tx = await contract.submitReport(imageUrl, location, description);
        await tx.wait();
        alert("Report Submitted Successfully!");
      } catch (error) {
        console.error("Blockchain transaction failed:", error);
        alert("Transaction failed!");
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Report Illegal Dumping</h1>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <input type="text" placeholder="Enter Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      <button onClick={submitReport} disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </div>
  );
}
