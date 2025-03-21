import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Check, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  useEffect(() => {
    fetchReminders();
    
    const subscription = supabase
      .channel('reminders_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'reminders' },
        handleReminderChange
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleReminderChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setReminders(prev => [payload.new, ...prev]);
      toast.success('New reminder added!');
    } else if (payload.eventType === 'UPDATE') {
      setReminders(prev => 
        prev.map(reminder => 
          reminder.id === payload.new.id ? payload.new : reminder
        )
      );
      toast.success('Reminder updated');
    } else if (payload.eventType === 'DELETE') {
      setReminders(prev => prev.filter(reminder => reminder.id !== payload.old.id));
      toast.success('Reminder deleted');
    }
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('reminders')
        .insert([formData]);

      if (error) throw error;
      
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        due_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Failed to add reminder');
    }
  };

  const toggleComplete = async (reminder: Reminder) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ completed: !reminder.completed })
        .eq('id', reminder.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error('Failed to update reminder');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reminders</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Reminder
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading reminders...</div>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              layout
              className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm ${
                reminder.completed ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => toggleComplete(reminder)}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      reminder.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {reminder.completed && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <div>
                    <h3 className={`font-semibold ${
                      reminder.completed ? 'line-through' : ''
                    }`}>
                      {reminder.title}
                    </h3>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {reminder.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {format(new Date(reminder.due_date), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(new Date(reminder.due_date), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Reminder Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Add New Reminder</h3>
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
                <label className="block text-sm font-medium mb-1">Due Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
                  required
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
                  Add Reminder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}