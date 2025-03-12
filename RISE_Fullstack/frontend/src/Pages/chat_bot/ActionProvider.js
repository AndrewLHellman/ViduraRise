import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    // Handle AI responses from ARES.py
    const handleAIResponse = (responseText) => {
        const botMessage = createChatBotMessage(responseText);
        
        setState((prev) => {
            // Get all messages except the last one (the thinking message)
            const filteredMessages = prev.messages.slice(0, -1);
            return {
                ...prev,
                messages: [...filteredMessages, botMessage],
            };
        });
    };
    
    // Handle thinking/loading state
    const handleThinking = () => {
        const thinkingMessage = createChatBotMessage("Thinking...", {
            widget: "thinkingWidget",
        });
        
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, thinkingMessage],
        }));
    };
    
    // Handle error messages
    const handleError = (errorText) => {
        const errorMessage = createChatBotMessage(errorText, {
            widget: "errorMessage",
        });
        
        setState((prev) => {
            // Get all messages except the last one (the thinking message)
            const filteredMessages = prev.messages.slice(0, -1);
            return {
                ...prev,
                messages: [...filteredMessages, errorMessage],
            };
        });
    };

    // Action to handle greeting
    const handleHello = () => {
        const botMessage = createChatBotMessage('Hello! How can I assist you with your research today?');
        
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    // Define all the actions our bot can perform
    const actions = {
        handleAIResponse,
        handleThinking,
        handleError,
        handleHello
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions,
                });
            })}
        </div>
    );
};

export default ActionProvider;