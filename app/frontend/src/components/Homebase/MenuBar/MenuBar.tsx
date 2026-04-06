import { useNavigate } from "react-router-dom";
import './MenuBar.css';

const MenuBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = (): void => {
        try {
            // Remove the auth token and user data from local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    const handleDashboardClick = (): void => {
        navigate('/dashboard');
    };

    const handleHomebaseClick = (): void => {
        navigate('/homebase');
    };

    return (
        <div className="menu-bar">
            <div className="menu-left">
                <h2>XCare Pro</h2>
            </div>
            <div className="menu-right">
                <button onClick={handleHomebaseClick} className="menu-button">Consultant</button>
                <button onClick={handleDashboardClick} className="menu-button">My Requests</button>
                <button onClick={handleLogout} className="menu-button logout">Sign Out</button>
            </div>
        </div>
    );
};

export default MenuBar;