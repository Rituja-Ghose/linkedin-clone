import React, { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/feed');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side: Login Form */}
      <div style={styles.formCard}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue your journey</p>

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>

        <p style={styles.footerText}>
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            style={styles.linkBtn}
          >
            Sign up here
          </button>
        </p>
      </div>

      {/* Right Side: Illustration / Branding */}
      <div style={styles.rightSide}>
        <h1 style={styles.brandHeading}>Welcome to LinkedIn Clone</h1>
        <p style={styles.brandText}>Connect. Share. Grow your professional network.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: 'linear-gradient(135deg, #d7e9f7, #a0c4ff, #0077b5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    color: '#333',
    fontFamily: 'Poppins, sans-serif',
  },
  formCard: {
    width: '400px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    textAlign: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0077b5',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    background: '#0077b5',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
  },
  footerText: {
    marginTop: '20px',
    color: '#444',
  },
  linkBtn: {
    border: 'none',
    background: 'none',
    color: '#0077b5',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: '600',
  },
  rightSide: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    paddingLeft: '60px',
  },
  brandHeading: {
    fontSize: '36px',
    fontWeight: '700',
  },
  brandText: {
    fontSize: '18px',
    marginTop: '10px',
  },
};
