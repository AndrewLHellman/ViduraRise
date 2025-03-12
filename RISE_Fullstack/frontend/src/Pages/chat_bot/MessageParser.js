import React from 'react';
import axios from 'axios';

const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
        // Show thinking message immediately
        actions.handleThinking();
        
        // Send all user messages to ARES.py endpoint for processing
        const sendToARES = async (userQuery) => {
            try {
                const response = await axios.post('http://localhost:5000/process_query', {
                    user_query: userQuery
                });
                
                if (response.data && response.data.response) {
                    // Log metadata for debugging
                    if (response.data.metadata) {
                        console.log(`Query processed in ${response.data.metadata.processing_time_seconds}s, response length: ${response.data.metadata.response_length} chars`);
                    }
                    
                    // Check for problematic responses
                    const aiResponse = response.data.response;
                    
                    if (aiResponse.length < 20) {
                        // Very short response, might indicate an issue
                        actions.handleError('I found some information, but it seems incomplete. Could you try rephrasing your question?');
                    } else {
                        // Pass the response to the ActionProvider
                        actions.handleAIResponse(aiResponse);
                    }
                } else if (response.data && response.data.error) {
                    // Handle error message from the server
                    actions.handleError(`${response.data.error}`);
                } else {
                    // Generic error for empty response
                    actions.handleError('Sorry, I received an empty response. Could you try again?');
                }
            } catch (error) {
                console.error('Error querying ARES:', error);
                let errorMessage = 'Sorry, I had trouble connecting to my knowledge base.';
                
                // Extract more specific error if available
                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
                
                actions.handleError(errorMessage);
            }
        };

        // Process all messages through ARES
        sendToARES(message);
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    parse: parse,
                    actions,
                });
            })}
        </div>
    );
};

export default MessageParser;