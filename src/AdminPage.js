// AdminPage.js
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import './admin.css';
import Drawer from './Drawer.js'
import AddUser from './AddUser.js';
const AdminPage = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false); // State for AddUser modal


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data.users);
            } catch (err) {
                toast.error("Failed to fetch users.");
                console.log(err);
            }
        };
        fetchUsers();
    }, []);

    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem('userEmail'); 
                const des = await fetch(`/api/current-user?email=${email}`);
                if (!des.ok) throw new Error('Failed to fetch user data');
                const newdata= await des.json();
                setUserData(newdata.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserData();
    }, []);

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setAdditionalInfo(user.additionalInfo || "");
        setIsModalOpen(true);
    };


    const handleSave = async () => {
        try {
            const res = await fetch(`/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ additionalInfo })
            });
            if (!res.ok) throw new Error('Failed to update user information');
            const data = await res.json();
            setUsers(users.map(user => user._id === data.user._id ? data.user : user));
            toast.success("User information updated successfully.");
            setIsModalOpen(false);
        } catch (err) {
            toast.error("Failed to update user information.");
            console.log(err);
        }
    };

    const closeModal1 = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const addUser = (user) => {
        // Add user logic...
        console.log("Adding user:", user);
        setUsers([...users, user]); // Update users state with new user
    };

    return (
        <>
        <div>
            <div>
            <ToastContainer />
            <div className='UpSection'>
                <div className='Welcome'>{userData && <h1>Welcome {userData.Fname}!</h1>} </div>

                <div className='AddUser'><button style={{width : "150px"}} onClick={() => setShowAddUserModal(true)}>Add User</button>
                <AddUser 
                    showModal={showAddUserModal} 
                    closeModal={() => setShowAddUserModal(false)} 
                    addUser={addUser} 
                />
                </div>

            </div>

            <Drawer />
            
            
            </div>
            <div className="user-cards">
                {users.map(user => (
                    <div key={user._id} className="user-card" onClick={() => handleCardClick(user)}>
                        <h2>{user.Fname} {user.Lname}</h2>
                        <p>Phone: {user.Phone}</p>
                        <p>Designation: {user.Designation}</p>
                        <p>Email: {user.Email}</p>
                        <p>Role: {user.role}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedUser && (
                <div className="modal1">
                    <div className="modal-content1">
                        <span className="close" onClick={closeModal1}>&times;</span>
                        <h2>{selectedUser.Fname} {selectedUser.Lname}</h2>
                        <textarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="Enter additional information here"
                        />
                        <button onClick={handleSave}>Save</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default AdminPage;
