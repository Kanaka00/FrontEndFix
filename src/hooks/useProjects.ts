import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  video_url?: string;
  demo_url: string;
  code_url: string;
  created_at?: string;
  user_id?: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('projects_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects(prev => [payload.new as Project, ...prev]);
            toast.success('New project added!');
          } else if (payload.eventType === 'DELETE') {
            setProjects(prev => prev.filter(project => project.id !== payload.old.id));
            toast.success('Project deleted');
          } else if (payload.eventType === 'UPDATE') {
            setProjects(prev => prev.map(project => 
              project.id === payload.new.id ? payload.new as Project : project
            ));
            toast.success('Project updated');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error loading projects');
    } finally {
      setLoading(false);
    }
  }

  return { projects, loading };
}