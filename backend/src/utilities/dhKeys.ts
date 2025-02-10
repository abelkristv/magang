import CryptoJS from 'crypto-js';

export const decryptData = (encryptedData: string, secretKey: string): any => {
    try {
        console.log("Received encryptedData:", encryptedData);

        
        if (!encryptedData || typeof encryptedData !== "string" || encryptedData.trim() === "") {
            throw new Error("Invalid encrypted data format");
        }

        
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        console.log("Decrypted text:", decryptedText); 

        
        if (!decryptedText) {
            throw new Error("Decryption failed: empty result");
        }

        
        return JSON.parse(decryptedText);
    } catch (error) {
        
        if (error instanceof Error) {
            console.error("Error decrypting data:", error.message);
            throw new Error("Failed to decrypt data: " + error.message);
        } else {
            console.error("Unknown error during decryption", error);
            throw new Error("Failed to decrypt data due to an unknown error");
        }
    }
};
