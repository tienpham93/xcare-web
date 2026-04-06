import React from "react";
import './HotTopics.css';

interface HotTopicsProps {
    onTopicSelect: (topic: string) => void;
}

const HotTopics: React.FC<HotTopicsProps> = ({ onTopicSelect }) => {
    const topics = [
        { index: 1, title: 'Covid-19', content: 'General sysmptoms of Covid-19 and best tips' },
        { index: 2, title: 'Online ticket submition', content: 'I would like to submit a ticket with title: <title> and content: <content>' },
    ];

    return (
        <div className="hot-topics-container">
            <h2>Quick Actions</h2>
            <ul>
                {topics.map((topic) => (
                    <li key={topic.index} onClick={() => onTopicSelect(topic.content)}>
                        <h3>{topic.title}</h3>
                        <p>{topic.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HotTopics;