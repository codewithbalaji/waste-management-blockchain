"use client";
import { ethers } from "ethers";
import ReportStorageABI from "../smart-contract/build/contracts/ReportStorage.json";

const CONTRACT_ADDRESS = "0x664B7E501212bF46b19f0eC0e985B9EC972224af";
const CLOUDINARY_UPLOAD_PRESET = "sample";
const CLOUDINARY_CLOUD_NAME = "dyj3rywju";

export const getContract = async (): Promise<ethers.Contract | null> => {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ReportStorageABI.abi, signer);
  }
  return null;
};

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url; // Cloudinary image URL
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    return null;
  }
};
