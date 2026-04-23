import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginModal({ onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Admin credentials
    if (username === 'admin' && password === 'admin123') {
      onLogin();
      onClose();
    } else {
      setError('Invalid credentials. Admin access only.');
    }
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
          <h3 className="login-title">Admin Login</h3>
          <button className="login-close-btn" onClick={onClose}>✕</button>
        </div>
        <p className="login-subtitle">Access the admin dashboard to manage plants and testimonials.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <div className="login-field">
            <label htmlFor="admin-username">Username</label>
            <input 
              id="admin-username" 
              type="text" 
              placeholder="Enter admin username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="login-field">
            <label htmlFor="admin-password">Password</label>
            <input 
              id="admin-password" 
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button className="login-submit" type="submit">Sign In</button>
        </form>
      </motion.div>
    </motion.div>
  );
}
