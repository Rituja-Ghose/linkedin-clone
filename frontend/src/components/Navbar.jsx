    import React, { useContext } from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import { AuthContext } from '../context/AuthContext';

    export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

    return (
        <nav style={styles.navbar}>
        {/* Left side - Logo always visible */}
        <div style={styles.left}>
            <Link to="/" style={styles.logo}>LinkedIn Clone</Link>
        </div>

        {/* Right side - changes based on login status */}
        <div style={styles.right}>
            {user ? (
            <>
                <Link to="/feed" style={styles.link}>Feed</Link>
                <Link to="/profile" style={styles.link}>Profile</Link>
                <span style={styles.username}>{user?.name}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
            ) : (
            !isAuthPage && (
                <>
                <button
                    onClick={() => navigate('/login')}
                    style={styles.authBtn}
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    style={{ ...styles.authBtn, backgroundColor: '#fff', color: '#0077b5' }}
                >
                    Sign Up
                </button>
                </>
            )
            )}
        </div>
        </nav>
    );
    }

    const styles = {
    navbar: {
    width: '100%',
    margin: 0,
    padding: '12px 30px',
    backgroundColor: '#0077b5',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    boxSizing: 'border-box'
    },

    left: { fontWeight: 'bold', fontSize: '20px' },
    right: { display: 'flex', alignItems: 'center', gap: '15px' },
    logo: { color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' },
    link: { color: 'white', textDecoration: 'none', fontSize: '16px' },
    username: { fontWeight: '600', fontSize: '16px' },
    logoutBtn: {
        backgroundColor: '#fff',
        color: '#0077b5',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    authBtn: {
        backgroundColor: '#0077b5',
        border: '2px solid white',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    };
