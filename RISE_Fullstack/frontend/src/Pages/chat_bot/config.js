import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';

// Create a simple widget for the bot
const ErrorMessageWidget = () => {
  return (
    <div className="error-message">
      <p>Sorry, I'm having trouble accessing my knowledge right now. Please try again later.</p>
    </div>
  );
};

// Create a thinking animation widget
const ThinkingWidget = () => {
  return (
    <div className="thinking-widget">
      <div className="dot-pulse"></div>
    </div>
  );
};

// Custom bot avatar with "V" instead of "B"
const CustomBotAvatar = () => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar">
      <div className="react-chatbot-kit-chat-bot-avatar-container">
        <p className="react-chatbot-kit-chat-bot-avatar-letter">V</p>
      </div>
    </div>
  );
};

const config = {
    initialMessages: [
        createChatBotMessage("Hello! I'm VIDURA, your research assistant."),
        createChatBotMessage("I can help answer questions about carbon nanotubes and related research. What would you like to know?")
    ],
    botName: "VIDURA",
    customStyles: {
        botMessageBox: {
            backgroundColor: "#376B7E",
        },
        chatButton: {
            backgroundColor: "#376B7E",
        },
    },
    customComponents: {
        botAvatar: (props) => <CustomBotAvatar {...props} />
    },
    widgets: [
        {
            widgetName: "errorMessage",
            widgetFunc: (props) => <ErrorMessageWidget {...props} />,
        },
        {
            widgetName: "thinkingWidget",
            widgetFunc: (props) => <ThinkingWidget {...props} />,
        }
    ]
};

export default config;