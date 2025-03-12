import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { Chatbot as ResearchChatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';

// Import components for the research chatbot
import config from './chat_bot/config';
import MessageParser from './chat_bot/MessageParser';
import ActionProvider from './chat_bot/ActionProvider';

// Simple chatbot component for Image analysis (existing functionality)
const ChatBotComponent = ({ data }) => {
    return (
        <div>
            <ChatBot
                headerTitle="RISE BOT"
                floating={false}
                floatingButtonNext={true}
                recognitionEnable={true}
                steps={data}
                />
        </div>
    )
}

// New component for VIDURA research assistant using ARES.py
export const ViduraChatbot = () => {
    const [showBot, setShowBot] = useState(true);

    const toggleBot = () => {
        setShowBot(prevState => !prevState);
    };

    return (
        <div className="vidura-chatbot-container">
            {showBot && (
                <div className="vidura-chatbot">
                    <div className="chatbot-header">
                        <button className="close-btn" onClick={toggleBot}>✕</button>
                    </div>
                    <ResearchChatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                </div>
            )}
            {!showBot && (
                <button 
                    className="chatbot-toggle" 
                    onClick={toggleBot}
                >
                    Chat with VIDURA
                </button>
            )}
        </div>
    );
};

export default ChatBotComponent;
