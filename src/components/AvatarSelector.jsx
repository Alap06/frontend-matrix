import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

// Default System Avatars
export const DEFAULT_AVATARS = [
    { id: 1, emoji: '👨‍💼', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 2, emoji: '👩‍💼', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 3, emoji: '🧑‍💻', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 4, emoji: '👨‍🏫', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 5, emoji: '👩‍🏫', bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { id: 6, emoji: '🎓', bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { id: 7, emoji: '📚', bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
    { id: 8, emoji: '🏅', bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { id: 9, emoji: '⭐', bg: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { id: 10, emoji: '🔷', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 11, emoji: '🟢', bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { id: 12, emoji: '🔴', bg: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' },
]

export const getCurrentAvatar = () => {
    const savedAvatar = localStorage.getItem('userAvatar')
    const avatarId = savedAvatar ? parseInt(savedAvatar) : 1
    return DEFAULT_AVATARS.find(a => a.id === avatarId) || DEFAULT_AVATARS[0]
}

export const saveAvatar = (avatarId) => {
    localStorage.setItem('userAvatar', avatarId.toString())
}

const AvatarSelector = ({ show, onClose, onSelect, selectedId, accentColor = '#3b82f6' }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Choisir un Avatar</h3>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <FiX size={24} />
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1rem'
                        }}>
                            {DEFAULT_AVATARS.map((avatar) => (
                                <motion.div
                                    key={avatar.id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onSelect(avatar.id)}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: avatar.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem',
                                        cursor: 'pointer',
                                        border: selectedId === avatar.id ? `4px solid ${accentColor}` : '4px solid transparent',
                                        boxShadow: selectedId === avatar.id ? `0 0 20px ${accentColor}40` : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {avatar.emoji}
                                </motion.div>
                            ))}
                        </div>

                        <p style={{
                            textAlign: 'center',
                            marginTop: '1.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem'
                        }}>
                            Cliquez sur un avatar pour le sélectionner
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AvatarSelector
