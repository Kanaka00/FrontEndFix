import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Trash2, AlertCircle, Edit3, Plus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MailData {
  id: string;
  subject: string;
  from: string;
  to: string;
  content: string;
  status: string;
  category: string;
  created_at: string;
}

export function MailDashboard() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'spam' | 'draft'>('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [mails, setMails] = useState<MailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    responseRate: 0,
    avgResponseTime: 0,
  });

  useEffect(() => {
    fetchMails();
    const subscription = supabase
      .channel('mails_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mails' }, handleMailChange)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeTab]);

  const handleMailChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setMails(prev => [payload.new, ...prev]);
      toast.success('New message received!');
    }
  };

  const fetchMails = async () => {
    try {
      const { data, error } = await supabase
        .from('mails')
        .select('*')
        .eq('category', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMails(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching mails:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (mailsData: MailData[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayMails = mailsData.filter(mail => 
      mail.created_at.startsWith(today)
    ).length;

    setStats({
      total: mailsData.length,
      today: todayMails,
      responseRate: 92, // Example static value
      avgResponseTime: 2.5, // Example static value
    });
  };

  const mailTabs = [
    { id: 'inbox' as const, label: 'Inbox', icon: Mail },
    { id: 'sent' as const, label: 'Sent', icon: Send },
    { id: 'spam' as const, label: 'Spam', icon: AlertCircle },
    { id: 'draft' as const, label: 'Drafts', icon: Edit3 },
  ];

  const mailStats = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Emails Received',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Emails Sent',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Mail Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Emails</h3>
          <p className="text-3xl font-bold text-cyan-600">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Received Today</h3>
          <p className="text-3xl font-bold text-cyan-600">{stats.today}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Response Rate</h3>
          <p className="text-3xl font-bold text-cyan-600">{stats.responseRate}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Avg Response Time</h3>
          <p className="text-3xl font-bold text-cyan-600">{stats.avgResponseTime}h</p>
        </div>
      </div>

      {/* Email Activity Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Email Activity</h3>
        <Line data={mailStats} />
      </div>

      {/* Mail Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex space-x-4">
              {mailTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors
                      ${activeTab === tab.id
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCompose(true)}
              className="flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Compose
            </motion.button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : (
            <div className="space-y-4">
              {mails.map((mail) => (
                <div
                  key={mail.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div>
                    <h4 className="font-semibold">{mail.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      From: {mail.from}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {mail.content}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(mail.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">New Message</h2>
              <button
                onClick={() => setShowCompose(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="To"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
              />
              <textarea
                rows={10}
                placeholder="Message"
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 resize-none"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}