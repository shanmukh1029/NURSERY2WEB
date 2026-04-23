 import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TestimonialForm({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onSubmit({
      id: Date.now().toString(),
      name,
      role: role || 'Customer',
      text,
      rating,
      createdAt: new Date().toLocaleString()
    });
    onClose();
  };

  return (
    <motion.div 
      className="login-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div 
        className="login-modal"
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-header">
          <h3 className="login-title">Share Your Experience</h3>
          <button className="login-close-btn" onClick={onClose}>✕</button>
        </div>
        <p className="login-subtitle">Tell us how Sri Satya Ramayya Nursery made your garden bloom.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="testi-name">Your Name *</label>
            <input id="testi-name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="login-field">
            <label htmlFor="testi-role">Role / Title</label>
            <input id="testi-role" type="text" placeholder="e.g. Garden Enthusiast" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="login-field">
            <label htmlFor="testi-text">Your Review *</label>
            <textarea id="testi-text" rows="4" placeholder="Share your experience with our nursery..." value={text} onChange={(e) => setText(e.target.value)} required style={{ resize: 'none', fontFamily: 'inherit' }}></textarea>
          </div>
          <div className="login-field">
            <label>Rating</label>
            <div className="testi-rating-picker">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star} 
                  type="button" 
                  className={`testi-star-btn ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <button className="login-submit" type="submit">Submit Testimonial</button>
        </form>
      </motion.div>
    </motion.div>
  );
}
