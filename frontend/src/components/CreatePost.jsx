import React, { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

export default function CreatePost({ onPosted }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user } = useContext(AuthContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image) formData.append('image', image);

      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setText('');
      setImage(null);
      setPreview(null);
      if (onPosted) onPosted(res.data);
    } catch (err) {
      alert('Failed to post');
    }
  };

  // Determine avatar URL
  const avatarUrl = user?.avatar
    ? user.avatar
    : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  return (
    <div style={styles.container}>
      <form onSubmit={submit} style={styles.form}>
        <div style={styles.header}>
          <img
            src={avatarUrl}
            alt="User Avatar"
            style={styles.avatar}
          />
          <textarea
            placeholder={`What's on your mind, ${user?.name || 'User'}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
          />
        </div>

        {preview && (
          <div style={styles.imagePreviewContainer}>
            <img src={preview} alt="preview" style={styles.imagePreview} />
            <button
              type="button"
              style={styles.removeImageBtn}
              onClick={() => {
                setPreview(null);
                setImage(null);
              }}
            >
              ✖
            </button>
          </div>
        )}

        <div style={styles.footer}>
          <label style={styles.imageUpload}>
            📷 Photo
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </label>

          <button type="submit" style={styles.postButton}>
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '15px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    margin: '20px auto',
    maxWidth: '600px',
  },
  form: { display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  avatar: { width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' },
  textarea: {
    flex: 1,
    resize: 'none',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    minHeight: '80px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  imagePreviewContainer: { position: 'relative', marginTop: '10px' },
  imagePreview: { width: '100%', borderRadius: '10px', marginTop: '5px' },
  removeImageBtn: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: '4px 6px',
    fontSize: '14px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    borderTop: '1px solid #eee',
    paddingTop: '10px',
  },
  imageUpload: { color: '#0a66c2', fontWeight: '600', cursor: 'pointer' },
  postButton: {
    backgroundColor: '#0a66c2',
    color: '#fff',
    border: 'none',
    borderRadius: '25px',
    padding: '8px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};
