import {
    getAuth,
    updateProfile,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    updatePassword,
  } from "firebase/auth";
  
  export class User {
    getMe() {
        const data = getAuth();
        return data.currentUser;
    }

    async updateDisplayName(displayName){
        try{
            const auth = getAuth();
            await updateProfile(auth.currentUser, {
                displayName,
            });
        } catch (error) {
            throw error;
        }
    }
  }