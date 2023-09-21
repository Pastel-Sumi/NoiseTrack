import React, { useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

//Components
import { LoggedNavigation } from "./routes"
import { Auth } from "./pages"

export default function App() {
    const[user, setUser] = useState(undefined)
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        setUser(user)
    });
    if(user === undefined) return null;
    
    return user ? <LoggedNavigation/> : <Auth/>
}

