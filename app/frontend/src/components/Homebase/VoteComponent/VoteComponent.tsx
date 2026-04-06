import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

interface VoteComponentProps {
    conversation: {
        user: string;
        bot: string;
        debug?: any;
    };
    onVote: (conversation: any, vote: 'like' | 'dislike') => void;
}

const VoteComponent: React.FC<VoteComponentProps> = ({ conversation, onVote }) => {
    const [voted, setVoted] = useState(false);

    const handleVote = (vote: 'like' | 'dislike') => {
        if (!voted) {
            onVote(conversation, vote);
            setVoted(true);
        }
    };

    return (
        <div className="vote-component">
            <button onClick={() => handleVote('like')} disabled={voted}>
                <FaThumbsUp />
            </button>
            <button onClick={() => handleVote('dislike')} disabled={voted}>
                <FaThumbsDown />
            </button>
        </div>
    );
};

export default VoteComponent;