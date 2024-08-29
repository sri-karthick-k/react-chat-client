import logoutFunc from "../../helpers/logoutFunc";

const DangerButton = () => {

    async function logout(){
        await logoutFunc();
        window.location = "/"
    }
    return(
        <button className="btn-danger" onClick={logout}>Logout</button>
    )
}

export default DangerButton;