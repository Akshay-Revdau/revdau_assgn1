
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './userpage.css';

const UserPage = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem('userEmail'); 
                const res = await fetch(`/api/current-user?email=${email}`);
                if (!res.ok) throw new Error('Failed to fetch user data');
                const data = await res.json();
                setUserData(data.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserData();
    }, []);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-page">
            <h1>Welcome, {userData.Fname}!</h1>
            <div className="user-card">
                <div className="user-info">
                    <p><strong>Name:</strong> {userData.Fname} {userData.Lname}</p>
                    <p><strong>Phone:</strong> {userData.Phone}</p>
                    <p><strong>Designation:</strong> {userData.Designation}</p>
                    <p><strong>Email:</strong> {userData.Email}</p>
                    {userData.additionalInfo && (
                    <p className="additional-info">{userData.additionalInfo}</p>)}
                </div>
            </div>
            <button onClick={() => navigate('/')} className="logout-btn">Logout</button>
        </div>
    );
};

export default UserPage;
