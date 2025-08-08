import {Outlet} from "react-router-dom";
import Navbar from "./Navbar";

function Layout(){
    return (
        <>
        <Navbar />
        <main style={{padding:"2rem", maxWidth:"800px", margin:"0 auto"}}>
            <Outlet/>
        </main>
        </>
    )
}

export default Layout;