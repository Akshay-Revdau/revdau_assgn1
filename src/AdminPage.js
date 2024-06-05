// AdminPage.js
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './admin.css';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div>
            <ToastContainer />
            <h1>Admin Page</h1>
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
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
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
    );
};

export default AdminPage;
