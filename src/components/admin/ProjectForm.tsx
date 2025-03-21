import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase';

interface ProjectFormProps {
  onClose: () => void;
  project?: {
    id: string;
    title: string;
    description: string;
    category: string;
    image_url: string;
    video_url?: string;
    demo_url: string;
    code_url: string;
  };
}

export function ProjectForm({ onClose, project }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'web-design',
    image_url: project?.image_url || '',
    video_url: project?.video_url || '',
    demo_url: project?.demo_url || '',
    code_url: project?.code_url || '',
  });

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video file size must be less than 100MB');
      return;
    }

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Upload video with progress tracking
      const { error: uploadError, data } = await supabase.storage
        .from('project-media')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-media')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, video_url: publicUrl }));
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (project?.id) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', project.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        // Create new project
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;
        toast.success('Project created successfully');
      }

      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {project ? 'Edit Project' : 'New Project'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="web-design">Web Design</option>
            <option value="fixes">Fixes</option>
            <option value="ui-ux">UI/UX Projects</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <input
            type="url"
            required
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Upload
          </label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="video-upload"
              disabled={loading}
            />
            <label
              htmlFor="video-upload"
              className={`flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium 
                ${loading 
                  ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Uploading...' : 'Upload Video'}
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}
            {formData.video_url && (
              <div className="mt-2">
                <video
                  src={formData.video_url}
                  controls
                  className="w-full rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Demo URL
          </label>
          <input
            type="url"
            required
            value={formData.demo_url}
            onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Code URL
          </label>
          <input
            type="url"
            required
            value={formData.code_url}
            onChange={(e) => setFormData({ ...formData, code_url: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}