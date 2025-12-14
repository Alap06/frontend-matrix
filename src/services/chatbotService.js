/**
 * Chatbot Service
 * API for interacting with the intelligent chatbot
 */
import api from './api'

/**
 * Send a message to the chatbot
 * @param {string} message - The user's question or message
 * @param {string} language - Language preference (default: 'fr')
 * @returns {Promise<Object>} The chatbot's response
 */
export const sendMessage = async (message, language = 'fr') => {
    const response = await api.post('/chatbot/chat/', {
        message,
        language
    })
    return response.data
}

export default {
    sendMessage
}
