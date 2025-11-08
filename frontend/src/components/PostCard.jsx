import React, { useState } from 'react';
import API from '../api';

export default function PostCard({ post, onDelete, onLike }) {
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/like/${post._id}`);
      if (onLike) onLike(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await API.put(`/posts/${post._id}`, { text: editText });
      setIsEditing(false);
      if (onLike) onLike(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await API.post(`/posts/comment/${post._id}`, { text: commentText });
      setCommentText('');
      if (onLike) onLike(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <img
            src={post.user?.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
            alt="User Avatar"
            style={styles.avatar}
          />
          <div>
            <strong style={styles.username}>{post.user?.name}</strong>
            <p style={styles.time}>{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <button style={styles.deleteBtn} onClick={handleDelete} title="Delete">
          ✖
        </button>
      </div>

      {/* Post content */}
      <div style={styles.content}>
        {isEditing ? (
          <div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={styles.editTextarea}
            />
            <button onClick={handleEdit} style={styles.saveBtn}>Save</button>
            <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        ) : (
          <p style={styles.text}>{post.text}</p>
        )}
        {post.image && <img src={post.image} alt="Post" style={styles.postImage} />}
      </div>

      {/* Actions: Like, Edit, Comment */}
      <div style={styles.actions}>
        <button style={styles.actionBtn} onClick={handleLike}>
          👍 Like {post.likes?.length > 0 ? `(${post.likes.length})` : ''}
        </button>
        <button style={styles.actionBtn} onClick={() => setIsEditing(true)}>✏️ Edit</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="text"
            placeholder="Add comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={styles.commentInput}
          />
          <button onClick={handleAddComment} style={styles.actionBtn}>💬</button>
        </div>
      </div>

      {/* Display comments */}
      {post.comments?.length > 0 && (
        <div style={styles.comments}>
          {post.comments.map((c, i) => (
            <p key={i}>
              <strong>{c.user?.name}</strong>: {c.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#74c1db', borderRadius: '10px', padding: '0px 0px 15px 0px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '15px' },
  header: { backgroundColor: '#38a6cb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', borderRadius: '10px 10px 0 0', padding: '10px 20px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '10px' },
  avatar: { width: '45px', height: '45px', borderRadius: '50%' },
  username: { fontSize: '15px', marginBottom: '2px' },
  time: { margin: 0, fontSize: '12px', color: '#4f4c4cff' },
  deleteBtn: { border: 'none', background: 'transparent', color: '#999', fontSize: '18px', cursor: 'pointer', padding: '5px' },
  content: { marginTop: '8px', marginBottom: '10px', paddingLeft: '50px' },
  text: { fontSize: '15px', lineHeight: '1.5', color: '#222', marginBottom: '10px' },
  editTextarea: { width: '100%', minHeight: '50px', padding: '5px', marginBottom: '5px', borderRadius: '6px' },
  saveBtn: { marginRight: '5px', padding: '5px 10px', backgroundColor: '#0a66c2', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  cancelBtn: { padding: '5px 10px', backgroundColor: '#999', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  postImage: { width: '60%', height: '50%', borderRadius: '10px', objectFit: 'cover', marginTop: '10px' },
  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '10px', gap: '10px', paddingLeft: '50px', paddingRight: '20px' },
  actionBtn: { border: 'none', background: 'transparent', color: '#0a66c2', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  commentInput: { padding: '5px', borderRadius: '5px', border: '1px solid #ccc' },
  comments: { paddingLeft: '50px', marginTop: '10px' },
};
