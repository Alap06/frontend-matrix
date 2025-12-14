import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiCpu, FiUser, FiZap, FiActivity } from 'react-icons/fi'
import { sendMessage } from '../../services/chatbotService'
import './ChatbotPage.css'

// Simple formatter component
const FormatMessage = ({ text }) => {
    if (!text) return null;

    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);

    return (
        <div className="formatted-text">
            {paragraphs.map((paragraph, index) => {
                // Check for lists
                // Matches lines starting with "- " or "1. " preceded by newline
                if (paragraph.includes('\n- ') || paragraph.includes('\n1. ') || paragraph.match(/^[-*]\s/) || paragraph.match(/^\d+\.\s/)) {
                    const lines = paragraph.split('\n');
                    // Check if it's mostly a list
                    const isList = lines.some(line => line.match(/^[-*]\s/) || line.match(/^\d+\.\s/));

                    if (isList) {
                        return (
                            <ul key={index} className="msg-list">
                                {lines.map((line, i) => {
                                    if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
                                        // Cleaning the marker for cleaner display
                                        const cleanLine = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
                                        return <li key={i}>{parseBold(cleanLine)}</li>;
                                    }
                                    // If line doesn't start with bullet, just render it as div inside list or separate p
                                    return <div key={i} style={{ marginBottom: '4px' }}>{parseBold(line)}</div>;
                                })}
                            </ul>
                        );
                    }
                }
                return <p key={index} className="msg-paragraph">{parseBold(paragraph)}</p>;
            })}
        </div>
    );
};

// Helper to parse **bold** text
const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

const ChatbotPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Bonjour ! Je suis votre assistant intelligent.\n\nPrêt à explorer le savoir ?",
            sender: 'bot',
            timestamp: new Date().toISOString()
        }
    ])
    const [inputText, setInputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    // Interactive Eye Tracking State
    const containerRef = useRef(null)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Track mouse movement for eye animation
    const handleMouseMove = (e) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        // Calculate relative position (-1 to 1)
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
        setMousePosition({ x, y })
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!inputText.trim()) return

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMessage])
        setInputText('')
        setIsTyping(false)
        setIsLoading(true)

        try {
            const response = await sendMessage(userMessage.text)
            const botMessage = {
                id: Date.now() + 1,
                text: response.response,
                sender: 'bot',
                timestamp: new Date().toISOString()
            }
            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage = {
                id: Date.now() + 1,
                text: "Mes circuits sont surchargés, veuillez réessayer plus tard.",
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isError: true
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate eye transform based on mouse position
    const eyeTransform = {
        transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
    }

    return (
        <div className="chatbot-wrapper" onMouseMove={handleMouseMove} ref={containerRef}>
            {/* Dynamic Background Elements */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="grid-overlay"></div>

            <div className="chatbot-content">
                {/* Holographic Avatar Section */}
                <div className="avatar-container">
                    <div className={`holo-ring ${isLoading ? 'spinning' : ''}`}></div>
                    <div className={`bot-avatar ${isLoading ? 'thinking' : ''} ${isTyping ? 'focused' : ''}`}>
                        <div className="bot-head-shape">
                            <div className="face-screen">
                                <div className="eye-row" style={isTyping ? {} : eyeTransform}>
                                    <div className={`cyber-eye left ${isLoading ? 'blink' : ''}`}>
                                        <div className="pupil"></div>
                                    </div>
                                    <div className={`cyber-eye right ${isLoading ? 'blink' : ''}`}>
                                        <div className="pupil"></div>
                                    </div>
                                </div>

                                {/* Visualizer Mouth */}
                                <div className="voice-visualizer">
                                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                                        <div
                                            key={`bar-${n}`}
                                            className={`viz-bar ${isLoading ? 'active' : ''}`}
                                            style={{
                                                animationDelay: `${n * 0.1}s`,
                                                height: isLoading ? undefined : '4px'
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="antenna">
                                <div className={`sensor ${isLoading ? 'pulsing' : ''}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bot-status">
                        {isLoading ? (
                            <span className="status-badge processing">
                                <FiZap className="icon-pulse" /> Traitement des données...
                            </span>
                        ) : isTyping ? (
                            <span className="status-badge listening">
                                <FiActivity /> Analyse de l'entrée...
                            </span>
                        ) : (
                            <span className="status-badge online">
                                <span className="dot"></span> Système en ligne
                            </span>
                        )}
                    </div>
                </div>

                {/* Glassmorphism Chat Interface */}
                <div className="chat-glass-panel">
                    <div className="messages-scroll-area">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className={`msg-row ${msg.sender === 'user' ? 'msg-user' : 'msg-bot'}`}
                                >
                                    <div className="msg-bubble">
                                        {msg.sender === 'bot' && <FiCpu className="msg-icon" />}

                                        <div className="msg-text-content">
                                            <FormatMessage text={msg.text} />
                                        </div>

                                        {msg.sender === 'user' && <FiUser className="msg-icon user" />}
                                    </div>
                                    <span className="msg-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="input-capsule">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onFocus={() => setIsTyping(true)}
                            onBlur={() => setIsTyping(false)}
                            placeholder="Posez votre question à l'IA..."
                            className="glass-input"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`send-trigger ${inputText.trim() ? 'active' : ''}`}
                            disabled={!inputText.trim() || isLoading}
                        >
                            <FiSend />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatbotPage
