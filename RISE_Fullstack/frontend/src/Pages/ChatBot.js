import React from 'react';
import ChatBot from 'react-simple-chatbot';

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

export default ChatBotComponent
