import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Placeholder for logout logic (e.g., clear token, session)
        console.log('User logged out');
        navigate('/');
    }, [navigate]);

    return (
        <div className="container mt-5">
            <h2>Logging out...</h2>
        </div>
    );
}

export default Logout;