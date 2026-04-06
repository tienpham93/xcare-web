import { useEffect, useState } from "react";
import { checkAuth, loadUserData } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { bffUrl } from "../../App";
import { Ticket, User } from "../../types";
import './Dashboard.css';
import MenuBar from "../Homebase/MenuBar/MenuBar";

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth(navigate);
        loadUserData(setUser, setError, setIsLoading);
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            const createdBy = user?.username;

            const response = await fetch(`${bffUrl}/webchat/tickets?createdBy=${createdBy}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },

            });

            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                setError('Failed to fetch tickets');
            }
        } catch (error) {
            setError('An error occurred while fetching tickets');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (ticketId: number) => {
        setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
    };

    return (
        <div className="dashboard-container">
            <MenuBar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>My Medical Requests</h1>
                </div>
                <div className="center-panel">
                    <div className="tickets">
                        {tickets.length === 0 && !isLoading && (
                            <p className="no-tickets">No medical requests found.</p>
                        )}
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="ticket-badge">
                                <div className="ticket" onClick={() => toggleExpand(parseInt(ticket.id))}>
                                    <div className="ticket-header">
                                        <h3>{ticket.title}</h3>
                                        <div className="ticket-meta">
                                            <span className="created-date">{new Date(ticket.createdDate).toLocaleDateString()}</span>
                                            <span className={`status-badge ${ticket.status.toLowerCase().replace(/\s+/g, '')}`}>{ticket.status}</span>
                                        </div>
                                    </div>
                                    {expandedTicketId === parseInt(ticket.id) && (
                                        <div className="ticket-content">
                                            <p>{ticket.content}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;