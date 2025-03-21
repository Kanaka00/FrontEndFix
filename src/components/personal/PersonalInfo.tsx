import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface PersonalInfo {
  id: string;
  bio: string;
  skills: string[];
  education: string[];
  experience: string[];
  interests: string[];
  social_links: Record<string, string>;
}

export function PersonalInfo() {
  const [info, setInfo] = useState<PersonalInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonalInfo();
    
    const subscription = supabase
      .channel('personal_info_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'personal_info' },
        (payload) => {
          if (payload.new) {
            setInfo(payload.new as PersonalInfo);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('personal_info')
        .select('*')
        .limit(1);

      if (error) throw error;
      setInfo(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching personal info:', error);
      toast.error('Failed to load personal information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!info) return;

    try {
      const { error } = await supabase
        .from('personal_info')
        .upsert(info);

      if (error) throw error;
      
      setEditing(false);
      toast.success('Personal information updated successfully');
    } catch (error) {
      console.error('Error saving personal info:', error);
      toast.error('Failed to save changes');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading personal information...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors w-full sm:w-auto justify-center"
        >
          {editing ? (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-5 w-5 mr-2" />
              Edit Info
            </>
          )}
        </motion.button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bio Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Bio</h3>
          {editing ? (
            <textarea
              value={info?.bio || ''}
              onChange={(e) => setInfo(prev => prev ? { ...prev, bio: e.target.value } : null)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-300">{info?.bio}</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {info?.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Education</h3>
          <ul className="space-y-4">
            {info?.education.map((edu, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">
                {edu}
              </li>
            ))}
          </ul>
        </div>

        {/* Experience Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
          <ul className="space-y-4">
            {info?.experience.map((exp, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300">
                {exp}
              </li>
            ))}
          </ul>
        </div>

        {/* Interests Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {info?.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="grid gap-4">
            {Object.entries(info?.social_links || {}).map(([platform, url]) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="capitalize">{platform}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-600 truncate ml-4"
                >
                  {url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}