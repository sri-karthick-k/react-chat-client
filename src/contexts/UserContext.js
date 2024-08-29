function saveUserDetails(key, value){
    localStorage.setItem(key, value);
}

function getUserDetails(key){
    return localStorage.getItem(key);
}

const UserContext = {
    saveUserDetails,
    getUserDetails
}

export default UserContext;