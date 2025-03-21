import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Send, Twitter } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      const { error } = await supabase
        .from('mails')
        .insert([{
          id: uuidv4(),
          subject: `Contact Form: ${formData.name}`,
          from: formData.email,
          to: 'admin@frontendfix.com',
          content: formData.message,
          status: 'sent',
          category: 'inbox',
        }]);

      if (error) throw error;

      setFormStatus('sent');
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have a project in mind? Let's work together to create something amazing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 outline-none transition-shadow resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={formStatus !== 'idle'}
              className="w-full px-8 py-3 bg-cyan-500 dark:bg-cyan-600 text-white rounded-full font-semibold hover:bg-cyan-600 dark:hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === 'idle' && (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
              {formStatus === 'sending' && 'Sending...'}
              {formStatus === 'sent' && 'Message Sent!'}
              {formStatus === 'error' && 'Error Sending Message'}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">Connect With Me</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Feel free to reach out through any of these platforms. I'm always excited to discuss new projects and opportunities.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="mailto:contact@frontendfix.com"
              className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <Mail className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
              <span>contact@frontendfix.com</span>
            </a>

            <div className="flex gap-4">
              <a
                href="#"
                className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass">
            <h3 className="text-xl font-bold mb-2">Office Hours</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Weekend: By appointment
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}