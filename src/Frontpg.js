import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Frontpg = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (e) => {
        e.preventDefault();
        
        const res = await fetch('/Frontpg', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });
        const data = await res.json();

        if (res.status === 200) {
            toast.success("Login successful!");
            console.log("Login successful.");
            localStorage.setItem('userEmail', email);
            setTimeout(() => {
                if (data.role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/user");
                }
            }, 2000); 
        } else if (res.status === 404) {
            toast.error("User not found.");
            console.log("User not found.");
        } else if (res.status === 401) {
            toast.error("Invalid password.");
            console.log("Invalid password.");
        } else if (res.status === 400) {
            toast.error("Please fill in all fields.");
            console.log("Please fill in all fields.");
        } else {
            toast.error("Something went wrong.");
            console.log("Something went wrong.");
        }
    };

    return (
        <>
            <div id="tabview">
                <ToastContainer />
                <div id="employ"></div>
                <div id="login">
                    <form id="signform" method="POST" style={{ border: "1px solid black" }} onSubmit={(e) => { loginUser(e); }} >
                        <div className="container">
                            <h1><b>Sign In</b></h1>
                            <label htmlFor="email"><b>Email</b></label>
                            <input type="text" placeholder="Enter Email" name="email"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label htmlFor="psw"><b>Password</b></label>
                            <input type="password" placeholder="Enter Password" name="psw"
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <span>If already a user, please Login.</span>
                        <div className="clearfix">
                            <button type="submit" className="cancelbtn">Login</button>
                            <button type="button" onClick={() => navigate("/Signup")} className="signupbtn">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Frontpg;
