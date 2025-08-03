import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/posts?page=${pageNum}&limit=10`);
      const newPosts = response.data.data.posts;

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content) => {
    try {
      const response = await api.post('/api/posts', { content });
      const newPost = response.data.data.post;
      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handleEditPost = async (postId, content) => {
    try {
      const response = await api.put(`/api/posts/${postId}`, { content });
      const updatedPost = response.data.data.post;
      setPosts(prev =>
        prev.map(post =>
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error('Error editing post:', error);
      throw error;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/api/posts/${postId}`);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1);
    }
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Welcome Banner */}
        {user && (
          <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-lg text-blue-100">Share your thoughts and connect with the community</p>
          </div>
        )}

        {/* Create Post */}
        {user && (
          <div className="rounded-2xl bg-white shadow-md p-6 text-gray-900">
            <CreatePost onSubmit={handleCreatePost} />
          </div>
        )}

        {/* Post Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <div
              key={post._id}
              className="transition transform duration-200 hover:scale-[1.01] rounded-2xl shadow-sm bg-white text-gray-900"
            >
              <PostCard
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center gap-2 justify-center px-6 py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-lg transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                'Load More Posts'
              )}
            </button>
          </div>
        )}

        {/* No Posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md mx-auto text-gray-900">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">
                {user
                  ? 'Be the first to share something with the community!'
                  : 'Sign up to start posting and connecting with others'}
              </p>
              {!user && (
                <p className="text-sm text-gray-500">Join the conversation today!</p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl shadow-md max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
