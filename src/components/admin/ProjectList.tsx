import { motion } from 'framer-motion';
import { Edit, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { ProjectForm } from './ProjectForm';
import { useProjects } from '../../hooks/useProjects';

export function ProjectList() {
  const { projects, loading } = useProjects();
  const [editingProject, setEditingProject] = useState<typeof projects[0] | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Error deleting project');
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading projects...</div>;
  }

  if (editingProject) {
    return (
      <ProjectForm
        project={editingProject}
        onClose={() => setEditingProject(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Projects</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div className="relative">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              {project.video_url && (
                <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                  <Video className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {project.description}
              </p>
              {project.video_url && (
                <div className="mb-4">
                  <video
                    src={project.video_url}
                    controls
                    className="w-full rounded-md"
                  />
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-600 dark:text-cyan-400">
                  {project.category}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}