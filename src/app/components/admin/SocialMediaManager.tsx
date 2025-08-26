'use client';

import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaWhatsapp, FaTelegram } from 'react-icons/fa';

interface SocialMedia {
  _id: string;
  platform: string;
  icon: string;
  url: string;
  isActive: boolean;
  order: number;
}

const SocialMediaManager = () => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    icon: '',
    url: '',
    isActive: true,
    order: 0
  });

  const iconOptions = [
    { value: 'FaFacebookF', label: 'Facebook', icon: FaFacebookF },
    { value: 'FaInstagram', label: 'Instagram', icon: FaInstagram },
    { value: 'FaTwitter', label: 'Twitter', icon: FaTwitter },
    { value: 'FaLinkedin', label: 'LinkedIn', icon: FaLinkedin },
    { value: 'FaYoutube', label: 'YouTube', icon: FaYoutube },
    { value: 'FaTiktok', label: 'TikTok', icon: FaTiktok },
    { value: 'FaWhatsapp', label: 'WhatsApp', icon: FaWhatsapp },
    { value: 'FaTelegram', label: 'Telegram', icon: FaTelegram },
  ];

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch('/api/social-media?admin=true');
      if (response.ok) {
        const data = await response.json();
        setSocialMedia(data.sort((a: SocialMedia, b: SocialMedia) => a.order - b.order));
      } else {
        console.error('Failed to fetch social media:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.platform.trim()) {
      alert('Platform name is required');
      return;
    }
    if (!formData.icon) {
      alert('Please select an icon');
      return;
    }
    if (!formData.url.trim()) {
      alert('URL is required');
      return;
    }
    
    try {
      const url = editingId ? `/api/social-media/${editingId}` : '/api/social-media';
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('Submitting social media data:', formData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Social media saved successfully:', result);
        setFormData({ platform: '', icon: '', url: '', isActive: true, order: 0 });
        setEditingId(null);
        fetchSocialMedia();
        alert(editingId ? 'Social media updated successfully!' : 'Social media added successfully!');
      } else {
        console.error('Failed to save social media:', result);
        alert(`Error: ${result.error || 'Failed to save social media'}`);
      }
    } catch (error) {
      console.error('Error saving social media:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleEdit = (item: SocialMedia) => {
    setEditingId(item._id);
    setFormData({
      platform: item.platform,
      icon: item.icon,
      url: item.url,
      isActive: item.isActive,
      order: item.order
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this social media link?')) {
      try {
        const response = await fetch(`/api/social-media/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchSocialMedia();
        }
      } catch (error) {
        console.error('Error deleting social media:', error);
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/social-media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchSocialMedia();
      }
    } catch (error) {
      console.error('Error updating social media:', error);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    if (iconOption) {
      const IconComponent = iconOption.icon;
      return <IconComponent size={20} />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DD4726] mx-auto"></div>
        <p className="text-gray-400 mt-2">Loading social media...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#F3F4F4] mb-2">Social Media Management</h2>
        <p className="text-gray-400">Manage your social media links and icons for the contact page.</p>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-[#1F1F1F] rounded-lg p-6 mb-8 border border-gray-700">
        <h3 className="text-lg font-semibold text-[#F3F4F4] mb-4">
          {editingId ? 'Edit Social Media Link' : 'Add New Social Media Link'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-[#F3F4F4] focus:outline-none focus:border-[#DD4726]"
                placeholder="e.g., Facebook, Instagram"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-[#F3F4F4] focus:outline-none focus:border-[#DD4726]"
                required
              >
                <option value="">Select an icon</option>
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-[#F3F4F4] focus:outline-none focus:border-[#DD4726]"
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-[#F3F4F4] focus:outline-none focus:border-[#DD4726]"
                min="0"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#DD4726] bg-[#2A2A2A] border-gray-600 rounded focus:ring-[#DD4726] focus:ring-2"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                Active
              </label>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-[#DD4726] hover:bg-[#B83A1E] text-white rounded-md transition-colors duration-300"
            >
              {editingId ? 'Update' : 'Add'} Social Media
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ platform: '', icon: '', url: '', isActive: true, order: 0 });
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Social Media List */}
      <div className="bg-[#1F1F1F] rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-[#F3F4F4]">Current Social Media Links</h3>
        </div>
        
        {socialMedia.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No social media links found. Add your first one above.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {socialMedia.map((item) => (
              <div key={item._id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#DD4726] rounded-full flex items-center justify-center text-white">
                    {getIconComponent(item.icon)}
                  </div>
                  <div>
                    <h4 className="text-[#F3F4F4] font-medium">{item.platform}</h4>
                    <p className="text-gray-400 text-sm">{item.url}</p>
                    <p className="text-gray-500 text-xs">Order: {item.order}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleActive(item._id, item.isActive)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      item.isActive
                        ? 'bg-green-600/20 text-green-400 border border-green-600'
                        : 'bg-gray-600/20 text-gray-400 border border-gray-600'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600 rounded text-xs font-medium hover:bg-blue-600/30"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600 rounded text-xs font-medium hover:bg-red-600/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaManager;
