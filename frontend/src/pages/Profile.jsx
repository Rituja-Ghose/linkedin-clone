import React, { useContext, useEffect, useState } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext); // allow updating user context
  const [myPosts, setMyPosts] = useState([]);
  const [file, setFile] = useState(null);

  // Fetch user's posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await API.get('/posts');
        const filtered = res.data.filter(p => p.user._id === user.id);
        setMyPosts(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchMyPosts();
  }, [user]);

  // 🔹 Update post likes immediately
  const handleLike = (updatedPost) => {
    setMyPosts(prev =>
      prev.map(p => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  // 🔹 Remove deleted post immediately
  const handleDelete = (id) => {
    setMyPosts(prev => prev.filter(p => p._id !== id));
  };

  // Handle profile picture upload
  const handlePicUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select an image first!');

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await API.post('/auth/uploadProfilePic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Use the correct key from backend response (res.data.url)
      setUser(prev => ({ ...prev, avatar: res.data.url }));
      alert('Profile picture updated!');
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Profile picture URL
  const profilePicUrl = user?.avatar
    ? user.avatar
    : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  return (
    <div style={styles.container}>
      {/* Profile Header */}
      <div style={styles.profileCard}>
        <img src={profilePicUrl} alt="Profile" style={styles.avatar} />
        <div style={styles.profileInfo}>
          <h1 style={{ margin: 0 }}>{user?.name}</h1>
          <p style={{ margin: 0 }}>Email: {user?.email}</p>
        </div>
      </div>

      {/* Upload Profile Picture */}
      <form onSubmit={handlePicUpload} style={styles.uploadForm}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.uploadButton}>
          Upload
        </button>
      </form>

      {/* User Posts */}
      <h2 style={{ marginTop: '20px' }}>My Posts</h2>
      {myPosts.length > 0 ? (
        myPosts.map(p => (
          <PostCard
            key={p._id}
            post={p}
            onLike={handleLike}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', paddingTop: '70px' },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#74c1db',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #0a66c2',
  },
  profileInfo: { display: 'flex', flexDirection: 'column' },
  uploadForm: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  fileInput: { padding: '8px', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer' },
  uploadButton: {
    padding: '8px 16px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};
