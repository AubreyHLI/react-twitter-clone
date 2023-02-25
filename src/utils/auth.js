import { useState, useContext, createContext, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from "firebase/firestore";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [profileId, setProfileId] = useState(null);
    const [currentAccount, setCurrentAccount] = useState({});

    useEffect(() => { 
    if(profileId) {
        const fetchProfileData = async () => {
            try {
            const docRef = doc(db, "profiles", profileId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const profile = docSnap.data();
                setCurrentAccount(u => ({
                    ...u, ...profile
                }));
                console.log('update currentAccount');
            }} catch(error) { 
                console.log('error:',error.message); 
            }
        };
        fetchProfileData(); // call it
    }}, [profileId]);


    // useEffect(() => {
    //     if(profileId) {
    //         try{
    //             onSnapshot(doc(db, "profiles", profileId), snapshot => {
    //                 console.log('onSnapshot currentAccount:', snapshot.data());
    //                 const profile = snapshot.data();
    //                 setCurrentAccount(u => ({
    //                     ...u, ...profile
    //                 }));
    //             })
    //         } catch (error) { console.log('error:',error.message); }
    //     }
    // }, [profileId]);


    const updateProfileId = (id) => {
        setProfileId(id);
    }

    const resetCurrentAccount = () => {
        setCurrentAccount(a => ({
          ...a, 
          userId: '', username: '', userImage: '', Email: '', tag: '',
        }));
        setProfileId(null);
    }


    return (
    <AuthContext.Provider value={{ profileId, updateProfileId, currentAccount, resetCurrentAccount }}>
        { children }
    </AuthContext.Provider>)
}

export const useAuth = () => {
    return useContext(AuthContext)
}