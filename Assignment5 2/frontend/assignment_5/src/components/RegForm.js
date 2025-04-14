// src/components/RegForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const { username, password, confirmPassword, email } = formData;

    const usernameRegex = /^[A-Za-z][A-Za-z0-9_-]{2,19}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?/`~]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|io)$/;

    if (!usernameRegex.test(username)) return 'Invalid username.';
    if (!passwordRegex.test(password)) return 'Password must be strong.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (!emailRegex.test(email)) return 'Invalid email address.';

    return '';
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        navigate('/login');
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch {
      setError('Server error. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {['username', 'password', 'confirmPassword', 'email'].map(field => (
        <div key={field} style={{ marginBottom: '15px' }}>
          <label htmlFor={field} style={{ display: 'block', marginBottom: '5px' }}>
            {field === 'confirmPassword' ? 'Confirm Password:' : `${field.charAt(0).toUpperCase() + field.slice(1)}:`}
          </label>
          <input
            type={field.includes('password') ? 'password' : 'text'}
            id={field}
            value={formData[field]}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      ))}

      {error && (
        <div style={{
          color: '#D32F2F',
          backgroundColor: '#FFEBEE',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          margin: '10px 0',
          opacity: isSubmitting ? 0.5 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#45A049'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
      >
        {isSubmitting ? 'Signing up...' : 'Signup'}
      </button>
    </form>
  );
};

export default RegForm;
