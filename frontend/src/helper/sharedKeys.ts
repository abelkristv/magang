import CryptoJS from 'crypto-js';
export const SECRET_KEY = "your-secret-key"; // Replace with a secure key

export const encryptData = (data: object, secretKey: string): { encryptedData: string } => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return { encryptedData };
};