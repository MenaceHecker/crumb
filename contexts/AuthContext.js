import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({children }) => {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    
    const fetchUserProfile = async (authUser) => {
        if (!authUser?.id) {
            setProfileData(null);
            return;
        }
        
        try {
            console.log('Fetching profile for user ID:', authUser.id);
            const { data, error } = await supabase
                .from('users') // Make sure this matches your table name
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
                console.error('Error fetching profile in AuthContext:', error);
                setProfileData(null);
            } else if (data) {
                console.log('Profile data fetched successfully:', data);
                setProfileData(data);
            } else {
                console.log('No profile data found');
                setProfileData(null);
            }
        } catch (error) {
            console.error('Error in fetchUserProfile:', error);
            setProfileData(null);
        }
    };

    const setAuth = authUser => {
        setUser(authUser);
        if (authUser) {
            fetchUserProfile(authUser);
        } else {
            setProfileData(null);
        }
    }
    
    const setUserData = userData => {
        setUser({...userData});
        // If updating user data, also update profile data if it contains profile fields
        if (userData && (userData.name || userData.address || userData.bio || userData.phoneNumber || userData.image)) {
            setProfileData(prevProfile => ({
                ...prevProfile,
                ...userData
            }));
        }
    }

    const refreshProfile = async () => {
        if (user) {
            await fetchUserProfile(user);
        }
    }

    // Combine auth user data with profile data
    const combinedUser = user ? { ...user, ...profileData } : null;

    return (
        <AuthContext.Provider value={{
            user: combinedUser, 
            setAuth, 
            setUserData,
            refreshProfile,
            profileData
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);