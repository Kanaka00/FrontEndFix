import { motion } from 'framer-motion';
import { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Video } from 'lucide-react';

type Category = 'all' | 'web-design' | 'fixes' | 'ui-ux';

export function PortfolioPage() {
  const { projects, loading } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web-design', label: 'Web Design' },
    { id: 'fixes', label: 'Fixes' },
    { id: 'ui-ux', label: 'UI/UX Projects' },
  ];

  const filteredProjects = projects.filter(
    project => selectedCategory === 'all' || project.category === selectedCategory
  );

  if (loading) {
    return <div className="text-center py-12">Loading projects...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore my latest projects and web development solutions
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map(category => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id as Category)}
            className={`px-6 py-2 rounded-full font-medium transition-colors
              ${selectedCategory === category.id
                ? 'bg-cyan-500 dark:bg-cyan-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl mb-4">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
              />
              {project.video_url && (
                <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                  <Video className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a
                  href={project.demo_url}
                  className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </a>
                <a
                  href={project.code_url}
                  className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Code
                </a>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
            {project.video_url && (
              <div className="mt-4">
                <video
                  src={project.video_url}
                  controls
                  className="w-full rounded-md"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}