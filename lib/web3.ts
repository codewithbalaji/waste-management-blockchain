"use client";
import { ethers } from "ethers";
import ReportStorageABI from "../smart-contract/build/contracts/ReportStorage.json";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    // We're using a simplified type for ethereum provider
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on: (eventName: string, callback: (...args: any[]) => void) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
      selectedAddress: string | undefined;
      isMetaMask?: boolean;
      chainId?: string;
    };
  }
}

const CONTRACT_ADDRESS = "0x6c140d512Dd29017D70a7ca9B255645293F8F300";
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
