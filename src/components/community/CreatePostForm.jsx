/**
 * CreatePostForm Component
 * Form for creating new community posts
 */

import { useState } from 'react';
import { useCommunity } from '@contexts/CommunityContext';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { Save, X, MessageSquare } from 'lucide-react';

const CreatePostForm = ({ onClose }) => {
  const { createPost } = useCommunity();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'general', name: 'General Discussion' },
    { id: 'investing', name: 'Investing' },
    { id: 'budgeting', name: 'Budgeting Tips' },
    { id: 'questions', name: 'Questions' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = createPost({
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
    });

    if (result.success) {
      onClose();
    } else {
      setErrors({ submit: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        label="Post Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="What's on your mind?"
        error={errors.title}
        required
        maxLength={200}
      />

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-11 pr-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Share your thoughts, questions, or insights..."
          rows={8}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/50 transition-all duration-200 resize-none"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-400">{errors.content}</p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" variant="primary" icon={Save}>
          Create Post
        </Button>

        <Button type="button" variant="outline" icon={X} onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;
