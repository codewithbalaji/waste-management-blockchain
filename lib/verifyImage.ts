"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function verifyIllegalDumping(imageUrl: string): Promise<{
  isIllegalDumping: boolean;
  confidence: number;
  explanation: string;
}> {
  try {
    // Get the generative model - using gemini-1.5-flash as recommended
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create a prompt for image analysis
    const prompt = `
      Analyze this image and determine if it shows illegal waste dumping or improper waste disposal.
      Rate your confidence from 0-100 on whether this image shows illegal dumping.
      Provide a brief explanation of what you see that indicates illegal dumping or why it might not be.
      Return your answer in JSON format:
      {
        "confidence": number between 0-100,
        "explanation": "brief explanation of your assessment"
      }
    `;

    // Create image part from URL
    const imagePart = {
      inlineData: {
        data: await fetchImageAsBase64(imageUrl),
        mimeType: "image/jpeg",
      },
    };

    // Generate content with the image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON response from Gemini");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    const confidence = parsedResponse.confidence || 0;

    return {
      isIllegalDumping: confidence >= 50,
      confidence,
      explanation: parsedResponse.explanation || "No explanation provided",
    };
  } catch (error) {
    console.error("Image verification failed:", error);
    return {
      isIllegalDumping: false,
      confidence: 0,
      explanation: "Failed to verify image: " + (error as Error).message,
    };
  }
}

// Helper function to fetch an image and convert it to base64
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}. URL does not point to a valid image.`);
    }
    
    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('Image has no content (zero bytes)');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const base64String = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = base64String.split(',')[1];
          if (!base64) {
            reject(new Error('Failed to extract base64 data from image'));
            return;
          }
          resolve(base64);
        } catch (err) {
          reject(new Error(`Error processing image data: ${err instanceof Error ? err.message : String(err)}`));
        }
      };
      reader.onerror = (err) => {
        reject(new Error(`FileReader error: ${err instanceof Error ? err.message : 'Unknown error'}`));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error in fetchImageAsBase64:', error);
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
