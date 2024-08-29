/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export const UserProvider = ({children}) => {
    const [user, setUser] = useState({});

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}