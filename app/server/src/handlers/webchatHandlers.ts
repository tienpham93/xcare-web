import { Request, Response } from 'express';
import { llmAgentHost } from '../env';

export const llmBaseUrl = `http://localhost:${llmAgentHost}`;

export const postGenerateHandler = async (req: Request, res: Response): Promise<void> => {
    const { message, sessionId, messageType, username } = req.body;
    try {
        const payload = {
            sessionId: sessionId,
            username: username,
            messageType: messageType,
            model: "llama3",
            prompt: message
        };

        console.log('payload', payload)

        const response = await fetch(`${llmBaseUrl}/agent/generate`, {
            method: 'POST',
            headers: {
                'authorization': req.headers.authorization || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        }

    } catch (error) {
        console.error('Failed to generate response', error);
        res.status(500).json({ success: false });
    }
};

export const postLoginHandler = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        const payload = {
            username: username,
            password: password
        };

        const response = await fetch(`${llmBaseUrl}/agent/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        }

    } catch (error) {
        console.error('Failed to login', error);
        res.status(500).json({ success: false });
    }
};

export const getTicketsHandler = async (req: Request, res: Response): Promise<void> => {
    const { createdBy } = req.query;
    try {
        const response = await fetch(`${llmBaseUrl}/agent/tickets?createdBy=${createdBy}`, {
            headers: {
                'Authorization': req.headers.authorization || '',
            },
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Failed to fetch tickets', error);
        res.status(500).json({ success: false });
    }
};

export const postAnalyticHandler = async (req: Request, res: Response): Promise<void> => {
    const { conversation, vote } = req.body;
    try {
        const response = await fetch(`${llmBaseUrl}/agent/analytic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': req.headers.authorization || '',
            },
            body: JSON.stringify({ 
                conversation: {
                    user: conversation.user,
                    bot: conversation.bot,
                },
                vote: vote,
                evalMetadata: conversation.debug
            }),   
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Failed to fetch tickets', error);
        res.status(500).json({ success: false });
    }
};