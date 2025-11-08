import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onPosted = (p) => setPosts((prev) => [p, ...prev]);
  const onDeleted = (id) => setPosts((prev) => prev.filter((x) => x._id !== id));
  const onLiked = (updated) =>
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  return (
    <div style={styles.feedContainer}>
      <div style={styles.feedWrapper}>
        <div style={styles.feedHeader}>
          <h2 style={{ margin: 0 }}>Home</h2>
        </div>
        <CreatePost onPosted={onPosted} />
        <div style={styles.postsContainer}>
          {posts.map((p) => (
            <PostCard key={p._id} post={p} onDelete={onDeleted} onLike={onLiked} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  feedContainer: {
    paddingTop: '80px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f3f2ef',
    minHeight: '100vh',
  },
  feedWrapper: {
    width: '100%',
    maxWidth: '650px',
    backgroundColor: 'transparent',
  },
  feedHeader: {
    backgroundColor: '#fff',
    padding: '15px 20px',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '15px',
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
};
