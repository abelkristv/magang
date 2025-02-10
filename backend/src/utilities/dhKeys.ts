import CryptoJS from 'crypto-js';

export const decryptData = (encryptedData: string, secretKey: string): any => {
    try {
        console.log("Received encryptedData:", encryptedData); // ✅ Log received data

        // ✅ Ensure encryptedData is valid
        if (!encryptedData || typeof encryptedData !== "string" || encryptedData.trim() === "") {
            throw new Error("Invalid encrypted data format");
        }

        // ✅ Attempt decryption
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        console.log("Decrypted text:", decryptedText); // ✅ Log decrypted output

        // ✅ Ensure decryption was successful
        if (!decryptedText) {
            throw new Error("Decryption failed: empty result");
        }

        // ✅ Ensure JSON parsing succeeds
        return JSON.parse(decryptedText);
    } catch (error) {
        // ✅ Type assertion to check if `error` is an instance of Error
        if (error instanceof Error) {
            console.error("Error decrypting data:", error.message);
            throw new Error("Failed to decrypt data: " + error.message);
        } else {
            console.error("Unknown error during decryption", error);
            throw new Error("Failed to decrypt data due to an unknown error");
        }
    }
};
