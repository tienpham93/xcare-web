import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, useEffect } from "react";
import { bffUrl } from '../../../App';
import { Message, User } from '../../../types';
import './Chatbox.css';
import { useNavigate } from 'react-router-dom';
import { parseAnswer } from '../../../utils/stringFormatter';
import { isKeywordsIncluded } from '../../../utils/commonHelper';
import VoteComponent from '../VoteComponent/VoteComponent';

interface ChatboxProps {
    inputValue: string;
    setInputValue: (value: string) => void;
}

const ChatBox: React.FC<ChatboxProps> = ({ inputValue, setInputValue }) => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const ChatDisplayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (ChatDisplayRef.current) {
            ChatDisplayRef.current.scrollTop = ChatDisplayRef.current.scrollHeight;
        }
    }, [chatHistory, isTyping]);

    // Set the input value to the selected topic
    useEffect(() => {
        if (inputValue) {
            setMessage(inputValue);
            inputRef.current?.focus();
        }
    }, [inputValue]);

    // Nagivate to login page when token is expired
    useEffect(() => {
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenExpiry');
            localStorage.removeItem('user');
            localStorage.removeItem('sessionId');
            localStorage.removeItem('sessionTimestamp');
            navigate('/');
        }
    }, []);

    // Add initial greeting message from bot
    useEffect(() => {
        const initialGreeting: Message = {
            id: uuidv4(),
            text: 'Good day. I am your XCare Digital Assistant. How can I support your healthcare needs today?',
            timestamp: new Date(),
            sender: 'bot',
        };
        setChatHistory([initialGreeting]);
    }, []);

    const handleMessageSend = async (e: React.FormEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const startOverKeywords = ['start over', 'restart', 'new conversation', 'new chat', 'new session'];
        const submitTicketKeywords = ['submit tickets', 'please submit', 'submit a ticket', 'raise tickets', 'create tickets', 'new ticket', 'raise request', 'submit request', 'create request', 'new request', 'submit a request'];

        const newMessage: Message = {
            id: uuidv4(),
            text: message,
            timestamp: new Date(),
            sender: 'user',
        };

        setChatHistory(prev => [...prev, newMessage]);
        setMessage('');
        setIsTyping(true);

        // Check for session expiration or specific user messages
        let sessionId = localStorage.getItem('sessionId');
        let sessionTimestamp = localStorage.getItem('sessionTimestamp');
        const currentTime = new Date().getTime();
        const sessionDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (
            !sessionId || !sessionTimestamp // No session data
            || currentTime - parseInt(sessionTimestamp) > sessionDuration // Session expired
            || isKeywordsIncluded(message, startOverKeywords) // User wants to start a new conversation
        ) {
            sessionId = uuidv4(); // Generate a new UUID for the session
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('sessionTimestamp', currentTime.toString());
            setChatHistory([]);
        }

        // Send the message to the BFF server
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 10 seconds timeout
            const username = localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user') as string)).username : '';
            const response = await fetch(`${bffUrl}/webchat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    username: username || '',
                    messageType: isKeywordsIncluded(message, submitTicketKeywords) ? 'submit' : 'general',
                    message: message,
                    sessionId: sessionId,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                const botResponse = data.conversation.message[1].content;
                const rawAnwser = parseAnswer(botResponse);
                const content = rawAnwser ? rawAnwser : 'Sorry! something went wrong. Please try again later.';

                if (data) {
                    setChatHistory(prev => [...prev, {
                        id: uuidv4(),
                        text: content,
                        timestamp: new Date(),
                        sender: 'bot',
                        debug: data.debug,
                    }]);
                }
            }

            // check token tokenExpiry in localStorage then Clear sessionId and sessionTimestamp
            const tokenExpiry = localStorage.getItem('tokenExpiry');
            if (tokenExpiry && currentTime > parseInt(tokenExpiry)) {
                localStorage.removeItem('sessionId');
                localStorage.removeItem('sessionTimestamp');
            }
        } catch (error) {
            setChatHistory(prev => [...prev, {
                id: uuidv4(),
                text: 'Sorry! something went wrong. Please try again later.',
                timestamp: new Date(),
                sender: 'bot',
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleVote = async (conversation: any, vote: 'like' | 'dislike') => {
        try {
            const response = await fetch(`${bffUrl}/webchat/analytic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ 
                    conversation: conversation,
                    vote: vote 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send vote');
            }
        } catch (error) {
            console.error('Error sending vote:', error);
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleMessageSend(e);
        };
    };

    return (
        <div className="chatbox-container">
            <div className="chat-header">
                <h2>XCare Assistant</h2>
            </div>

            <div className="chat-display" ref={ChatDisplayRef}>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <p>{message.text}</p>
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.sender === 'bot' && (
                            <VoteComponent conversation={{
                                user: chatHistory[index - 1]?.text || '',
                                bot: message?.text || '',
                                debug: message?.debug
                            }} onVote={handleVote} />
                        )}
                    </div>
                ))}
                {isTyping && <div className="chat-message bot">
                    <p>Wait me a sec...</p>
                </div>}
            </div>
            <form onSubmit={handleMessageSend} className="chat-input-form">
                <input
                    type="text"
                    placeholder="Type a message..."
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        setInputValue(e.target.value);
                    }}
                />
                <button type="submit" disabled={!message.trim()}>Send</button>
            </form>
        </div>
    );
};

export default ChatBox;