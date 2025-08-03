import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/users/${userId}`);
      const { user: userData, posts: userPosts } = response.data.data;
      setUser(userData);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleEditPost = async (postId, content) => {
    try {
      const response = await api.put(`/api/posts/${postId}`, { content });
      const updatedPost = response.data.data.post;
      setPosts(prev =>
        prev.map(post => post._id === postId ? updatedPost : post)
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

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-orange-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-14 h-14 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-700">This user does not exist or may have been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* User Info */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-10">
              <div className="relative">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <span className="text-white text-4xl font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <div className="space-y-2 text-indigo-100 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span className="text-lg">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Joined {dayjs(user.createdAt).format('MMMM YYYY')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="p-8 bg-gray-50">
              <div className="flex items-start gap-3">
                <User size={20} className="text-indigo-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">About</h3>
                  <p className="text-gray-700 text-base leading-relaxed">{user.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Posts by {user.name}</h2>
              <p className="text-gray-600">{posts.length} {posts.length === 1 ? 'post' : 'posts'} shared</p>
            </div>
            {posts.length > 0 && (
              <div className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-medium">
                {posts.length} total
              </div>
            )}
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post._id} className="transition-transform duration-200 hover:scale-[1.02]">
                  <PostCard
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">No posts yet</h3>
              <p className="text-gray-600">{user.name} hasn’t shared anything yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
