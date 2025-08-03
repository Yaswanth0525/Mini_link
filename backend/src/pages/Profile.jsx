import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Edit, Save, X, Camera, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      profilePicture: user?.profilePicture || '',
    });
    setIsEditing(false);
  };

  if (!user) return <p className="text-center text-gray-600 mt-10">Loading user...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Your Profile</h1>
          <p className="text-gray-700 mt-2">Manage your personal information and preferences</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {formData.profilePicture ? (
                    <img
                      src={formData.profilePicture}
                      alt={formData.name || 'User'}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white text-white font-bold text-3xl shadow-md">
                      {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow">
                      <Camera className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{formData.name || 'Unnamed User'}</h2>
                  <p className="text-purple-100">{user.email}</p>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-xl font-semibold flex items-center space-x-2"
                >
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Profile Picture Input */}
            {isEditing && (
              <div className="bg-gray-50 p-6 rounded-2xl">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Camera size={18} className="mr-2" />
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* Name */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User size={18} className="mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">{formData.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail size={18} className="mr-2" />
                Email Address
              </label>
              <p className="text-lg font-medium text-gray-800">{user.email}</p>
              <p className="text-sm text-gray-500 mt-1">Email address cannot be changed</p>
            </div>

            {/* Bio */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span>{formData.bio.length}/500 characters</span>
                    {formData.bio.length > 0 && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-800">{formData.bio || 'No bio added yet'}</p>
                  {!formData.bio && (
                    <p className="text-sm text-gray-500 mt-2">Add a bio to tell others about yourself</p>
                  )}
                </>
              )}
            </div>

            {/* Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
