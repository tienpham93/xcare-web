import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bffUrl } from "../../App";
import './Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/homebase');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${bffUrl}/webchat/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('tokenExpiry', (Date.now() + 300000).toString());
                localStorage.setItem('user', JSON.stringify(data.userMetadata));

                navigate('/homebase');
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('Failed to login. Please try again.');
            console.error('Failed to login', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-panel">
                <div className="login-brand">
                    <h1>XCare</h1>
                    <p>Clinical Intelligence Portal</p>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Sign In</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
                <div className="login-footer">
                    <p>&copy; 2026 XCare Healthcare System</p>
                    <p>Secure Patient Data Environment</p>
                </div>
            </div>
        </div>
    );
};

export default Login;