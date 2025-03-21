import { motion } from 'framer-motion';
import { Plus, LogOut, Layout, User, Calendar, Bell, FolderGit2, Mail, BarChart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { ProjectList } from '../../components/admin/ProjectList';
import { MailDashboard } from '../../components/mail/MailDashboard';
import { PersonalInfo } from '../../components/personal/PersonalInfo';
import { DailyActivities } from '../../components/activities/DailyActivities';
import { Reminders } from '../../components/reminders/Reminders';
import toast from 'react-hot-toast';

type DashboardSection = 'projects' | 'personal' | 'activities' | 'reminders' | 'mail' | 'analytics';

export function DashboardPage() {
  const { signOut } = useAuth();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>('mail');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { id: 'mail' as const, label: 'Mail', icon: Mail },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart },
    { id: 'projects' as const, label: 'Projects', icon: FolderGit2 },
    { id: 'personal' as const, label: 'Personal Info', icon: User },
    { id: 'activities' as const, label: 'Daily Activities', icon: Calendar },
    { id: 'reminders' as const, label: 'Reminders', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'mail':
        return <MailDashboard />;
      case 'analytics':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Email analytics and metrics coming soon...
            </p>
          </div>
        );
      case 'projects':
        return showProjectForm ? (
          <ProjectForm onClose={() => setShowProjectForm(false)} />
        ) : (
          <ProjectList />
        );
      case 'personal':
        return <PersonalInfo />;
      case 'activities':
        return <DailyActivities />;
      case 'reminders':
        return <Reminders />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 pt-20">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {activeSection === 'projects' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 w-full sm:w-auto justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Project
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 w-full sm:w-auto justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-4 bg-cyan-500 text-white rounded-full shadow-lg"
        >
          <Layout className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 flex-shrink-0 ${showMobileMenu ? 'fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:relative lg:bg-transparent lg:backdrop-blur-none' : 'hidden lg:block'}`}>
            <nav className={`space-y-1 bg-white dark:bg-gray-800 p-4 rounded-lg ${showMobileMenu ? 'h-auto max-h-[80vh] overflow-y-auto m-4 lg:m-0' : ''}`}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${activeSection === item.id
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}