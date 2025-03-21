import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Calendar as CalendarIcon, Clock, Tag } from 'lucide-react';
import Calendar from 'react-calendar';
import TimePicker from 'react-time-picker';
import toast from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  activity_date: string;
  activity_time: string;
  user_id: string;
}

export function DailyActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    duration: 30,
    activity_time: '09:00',
  });

  useEffect(() => {
    fetchActivities();
    
    const subscription = supabase
      .channel('activities_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'activities' },
        handleActivityChange
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedDate]);

  const handleActivityChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setActivities(prev => [payload.new, ...prev]);
      toast.success('New activity added!');
    } else if (payload.eventType === 'DELETE') {
      setActivities(prev => prev.filter(activity => activity.id !== payload.old.id));
      toast.success('Activity deleted');
    }
  };

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('activity_date', selectedDate.toISOString().split('T')[0])
        .order('activity_time', { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('activities')
        .insert([{
          ...formData,
          activity_date: selectedDate.toISOString().split('T')[0],
        }]);

      if (error) throw error;
      
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'work',
        duration: 30,
        activity_time: '09:00',
      });
      toast.success('Activity added successfully');
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    }
  };

  const categories = [
    { id: 'work', label: 'Work' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'study', label: 'Study' },
    { id: 'personal', label: 'Personal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold">Daily Activities</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Activity
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-full border-none"
          />
        </div>

        {/* Activities List */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Activities for {selectedDate.toLocaleDateString()}
          </h3>
          {loading ? (
            <div className="text-center py-8">Loading activities...</div>
          ) : activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activities scheduled for this day</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{activity.title}</h4>
                    <span className="text-sm text-gray-500">{activity.activity_time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {activity.duration} min
                    </span>
                    <span className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {activity.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">Add New Activity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <TimePicker
                  value={formData.activity_time}
                  onChange={(value) => setFormData({ ...formData, activity_time: value as string })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  min="5"
                  step="5"
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}