"use client";
import { useState } from "react";
import { getContract, uploadToCloudinary } from "@/lib/web3";
import { verifyIllegalDumping } from "@/lib/verifyImage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set to true to bypass image verification for development/testing
const DEV_MODE = false;

export default function Report() {
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageName, setImageName] = useState<string>("");
  const [fetchingLocation, setFetchingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<{ 
    isIllegalDumping: boolean;
    confidence: number;
    explanation: string;
  } | null>(null);
  // Use DEV_MODE directly without toggle in UI
  const bypassVerification = DEV_MODE;

  const submitReport = async () => {
    if (!image || !location || !description) {
      toast.error("All fields are required!");
      return;
    }
    
    setLoading(true);

    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) {
        toast.error("Image upload failed!");
        setLoading(false);
        return;
      }

      // Skip verification if bypass is enabled
      if (!bypassVerification) {
        // Verify image using Gemini AI
        const verification = await verifyIllegalDumping(imageUrl);
        setVerificationResult(verification);
        
        // Only proceed if confidence is >= 50%
        if (!verification.isIllegalDumping) {
          toast.warning(`Verification failed: AI is only ${verification.confidence}% confident this shows illegal dumping.`, {
            autoClose: 5000
          });
          setLoading(false);
          return;
        }
      } else {
        // Log that verification was bypassed
        console.log("Image verification bypassed in development mode");
        setVerificationResult({
          isIllegalDumping: true,
          confidence: 100,
          explanation: "Verification bypassed in development mode"
        });
        toast.info("Image verification bypassed in development mode", { autoClose: 2000 });
      }

      // Submit verified report to blockchain
      const contract = await getContract();
      if (contract) {
        try {
          const tx = await contract.submitReport(
            imageUrl, 
            location, 
            `${description}\n\nVerification: ${bypassVerification ? 'Bypassed in development mode' : `${verificationResult?.confidence}% confident it shows illegal dumping`}`
          );
          await tx.wait();
          toast.success("Report Submitted Successfully!");
          setImage(null);
          setLocation("");
          setDescription("");
          setImageName("");
          setVerificationResult(null);
        } catch (error) {
          console.error("Blockchain transaction failed:", error);
          toast.error("Transaction failed!");
        }
      }
    } catch (error) {
      console.error("Error during report submission:", error);
      toast.error("Report submission failed!");
    }

    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setImageName(file?.name || "");
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    
    setFetchingLocation(true);
    setLocationError("");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setFetchingLocation(false);
      },
      (error) => {
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-6 px-4 sm:py-10">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 p-4 text-white">
          <h1 className="text-xl font-bold text-center sm:text-2xl">Report Illegal Dumping</h1>
          <p className="text-xs text-center mt-1 text-green-100 sm:text-sm">Help keep our environment clean</p>
        </div>
        
        <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
          {verificationResult && (
            <div className={`p-3 rounded-lg text-sm ${
              verificationResult.isIllegalDumping 
                ? "bg-green-100 text-green-800 border border-green-300" 
                : "bg-red-100 text-red-800 border border-red-300"
            }`}>
              <p className="font-medium">
                {verificationResult.isIllegalDumping 
                  ? `✓ Verified as illegal dumping (${verificationResult.confidence}% confidence)` 
                  : `✗ Not verified as illegal dumping (${verificationResult.confidence}% confidence)`
                }
              </p>
              <p className="mt-1">{verificationResult.explanation}</p>
              {verificationResult.explanation.includes('Failed to verify image') && (
                <div className="mt-2 text-xs bg-yellow-50 p-2 rounded border border-yellow-200">
                  <p className="font-medium text-yellow-700">Troubleshooting:</p>
                  <ul className="list-disc pl-4 mt-1 text-yellow-700 space-y-1">
                    <li>Check that you have a valid Gemini API key</li>
                    <li>Ensure the image is a valid format (JPG, PNG)</li>
                    <li>Try a different image with clearer evidence of waste dumping</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Photo Evidence</label>
            <div className="relative">
              <div className="border-2 border-dashed border-green-300 rounded-lg p-3 text-center hover:bg-green-50 transition cursor-pointer sm:p-4">
                <input 
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-10 w-10 text-green-400 sm:h-12 sm:w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    {imageName ? imageName : "Tap to take a photo or upload"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <input 
                id="location"
                type="text" 
                placeholder="current location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                disabled
                className="w-full p-2 pl-3 pr-10 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:p-3"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={fetchingLocation}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-green-600 hover:text-green-800"
              >
                {fetchingLocation ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                )}
              </button>
            </div>
            {locationError && <p className="text-xs text-red-500 mt-1">{locationError}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              id="description"
              placeholder="Describe what you observed..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:p-3"
            ></textarea>
          </div>
          
          <button 
            onClick={submitReport} 
            disabled={loading} 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center sm:py-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
} 