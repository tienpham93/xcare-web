import { User } from "../../../types";
import './UserInfo.css';

interface UserInfoProps {
    user: User;
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <div className="user-info-container">
            <div className="user-info-header">
                <div className="user-info-avatar">
                    <img src="/ok.jpg" alt="User avatar" />
                </div>
                <h2>Patient Profile</h2>
            </div>
            <div className="user-info-details">
                <div className="user-info-item">
                    <span className="user-info-label">Patient ID</span>
                    <span className="user-info-value">{user.username}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Gender</span>
                    <span className="user-info-value">{user.gender}</span>
                </div>
                <div className="user-info-item">
                    <span className="user-info-label">Age</span>
                    <span className="user-info-value">{user.age} yrs</span>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;