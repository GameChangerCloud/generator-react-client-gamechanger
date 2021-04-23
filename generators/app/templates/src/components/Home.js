import React, {useEffect} from 'react';
import {APIurl} from '../constants'
import {toast} from "react-toastify";

const endpoint = APIurl

function Home({onLoad, isLoggedIn, history}) {


    useEffect(() => {
        if(isLoggedIn) {
            onLoad()
        }
        else {
             if ((!history.location.hash && !history.location.search && history.action === "REPLACE")) {
                toast.dismiss()
                toast.error("Error: You must be connected to access this ressource")
            }
        }
}, []);

    return (
        <div className="form">
        <h1 className="welcome">Welcome</h1>

        <b>This is your endpoint :</b> {endpoint}

    <br/>
    <br/>
    <b>This is your graphql schema :</b>
    <br/>
    <br/>

    <%-graphqlSchema%>

    </div>
);
}

export default Home;
