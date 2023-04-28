import React, { useState } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState('');
    const [userImageSrc, setUserImageSrc] = useState('');
    const [accessToken, setAccessToken] = useState('');
    return (
        <AuthContext.Provider value={{ username, setUsername, userImageSrc, setUserImageSrc, accessToken, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};