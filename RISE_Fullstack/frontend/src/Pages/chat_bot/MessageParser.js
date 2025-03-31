import React from 'react';
import axios from 'axios';
import API from '../../Common/ApiConfig';

const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
        // Show thinking message immediately
        actions.handleThinking();

        // Check if the message matches temperature and thickness pattern
        const checkForTempThickness = (text) => {
            // Case insensitive regular expression to match "temperature" and "thickness" with numbers
            const pattern = /temperature\s+(\d+)/i;
            const thicknessPattern = /thickness\s+(\d+(?:\.\d+)?)/i;

            return pattern.test(text) && thicknessPattern.test(text);
        };

        // Send request to regression API when temperature and thickness are detected
        const sendToRegressionAPI = async (userQuery) => {
            try {
                const response = await axios.post(API.CHATBOT.REGRESSION, {
                    user_query: userQuery
                });

                if (response.data && Array.isArray(response.data)) {
                    // Get the last 5 records from the response
                    const lastFiveRecords = response.data.slice(-5);

                    // Format the response as a fixed-width text table with aligned columns
                    const formattedResponse = "Here are the predicted CNT growth rates for the specified temperature and thickness:\n" +
                        "\n" +
                        "Time (s)    | Temperature (°C) | Thickness (nm) | Growth Rate (μm/s)\n" +
                        "----------- | --------------- | ------------- | -----------------\n" +
                        lastFiveRecords.map(record =>
                            `${record['Time (t, s)'].toString().padEnd(11)} | ${record['Temperature (Tp, °C)'].toString().padEnd(15)} | ${record['Catalyst Thickness (d, nm)'].toString().padEnd(13)} | ${record['CNT-G (micrometers/s)'].toFixed(4).padEnd(17)}`
                        ).join('\n') +
                        "\n";

                    actions.handleAIResponse(formattedResponse);
                } else if (response.data && response.data.error) {
                    actions.handleError(`${response.data.error}`);
                } else {
                    actions.handleError('Sorry, I received an unexpected response from the regression model. Please try again.');
                }
            } catch (error) {
                console.error('Error querying regression API:', error);
                let errorMessage = 'Sorry, I had trouble connecting to the regression model.';

                if (error.response && error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                }

                actions.handleError(errorMessage);
            }
        };

        // Send all user messages to ARES.py endpoint for processing
        const sendToARES = async (userQuery) => {
            try {
                const response = await axios.post(API.CHATBOT.ARES, {
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

        // Check if message contains temperature and thickness
        if (checkForTempThickness(message)) {
            sendToRegressionAPI(message);
        } else {
            // Process message through ARES
            sendToARES(message);
        }
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
