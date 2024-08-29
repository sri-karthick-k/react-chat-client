import axios from "axios";

async function logoutFunc(){
    try {
        await axios.get('http://localhost:5000/logout', { withCredentials: true });
        localStorage.clear();
    } catch (error) {
        console.error('Error logging out:', error);
    }
} 

export default logoutFunc