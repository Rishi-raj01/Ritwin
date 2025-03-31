import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import AdminMenu from '../../components/Layout/AdminMenu';

const User = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [isMenuVisible, setIsMenuVisible] = useState(true);

    // Fetch all users
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/v1/user/all-user');
            setUsers(data?.users);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    // Handle navigation to user orders
    const handleUserClick = (userId, name) => {
        navigate(`/dashboard/admin/users/user-orders/${userId}`, {
            state: { name: name }, // Pass name through state
        });
    };

    // Toggle admin menu visibility
    const toggleMenuVisibility = () => {
        setIsMenuVisible((prev) => !prev);
    };

    return (
        <Layout title={'Dashboard - All Users'}>
            <div
                className="container-fluid py-5"
                style={{
                    backgroundImage: "url('https://asset.gecdesigns.com/img/wallpapers/aesthetic-purple-orange-beautiful-nature-desktop-wallpaper-sr10012413-1706503295947-cover.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                }}
            >
                <div className="row">
                    {/* Admin Menu Section */}
                    {isMenuVisible && (
                        <div className="col-md-3">
                            <AdminMenu toggleMenu={toggleMenuVisibility} />
                        </div>
                    )}

                    {/* Main Content Section */}
                    <div className={`col ${isMenuVisible ? 'col-md-9' : 'col-md-12'}`}>
                        <div className="row d-flex justify-content-center">
                            {users?.map((user) => (
                                <div
                                    key={user._id}
                                    className="card mx-3 my-3 shadow-lg text-white"
                                    style={{
                                        width: '18rem',
                                        cursor: 'pointer',
                                        backgroundColor: 'rgba(0, 0, 0, 0.19)',
                                        border: 'none',
                                        borderRadius: '10px',
                                    }}
                                    onClick={() => handleUserClick(user._id, user.name)}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title">{user.name}</h5>
                                        <h6 className="card-subtitle mb-2">{user.location}</h6>
                                        <h6 className="card-subtitle mb-2">{user.email}</h6>
                                        <h6 className="card-subtitle mb-2">{user.phone}</h6>
                                        <h6 className="card-subtitle mb-2">{new Date(user.createdAt).toLocaleDateString()}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default User;
