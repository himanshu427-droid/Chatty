import {initializeApp, cert} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import serviceAccount from "../../firebase_service_account.json" with {type: "json"};
import {config} from "dotenv";

config()

initializeApp({
    credential : cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    

    
    })
});

export const verifyIdToken = async(idToken) => {
    try {
        const decodedToken = await getAuth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("Error verifying ID Token: ", error);
        throw error;
    }

};
