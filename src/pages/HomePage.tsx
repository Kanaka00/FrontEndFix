import { motion } from 'framer-motion';
import { Code2, Laptop, Palette, Smartphone, Star } from 'lucide-react';

export function HomePage() {
  const services = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'UI/UX Design',
      description: 'Creating intuitive and engaging user experiences with modern design principles.',
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Front-End Development',
      description: 'Building responsive and performant web applications with the latest technologies.',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Responsive Design',
      description: 'Ensuring your website looks and works perfectly on all devices.',
    },
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <Code2 className="w-24 h-24 text-cyan-500 dark:text-cyan-400" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">
              FrontEndFix
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transforming ideas into exceptional web experiences through modern front-end development and UI/UX design.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#services"
                className="px-8 py-3 bg-cyan-500 dark:bg-cyan-600 text-white rounded-full font-semibold hover:bg-cyan-600 dark:hover:bg-cyan-700 transition-colors"
              >
                Explore Services
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/portfolio"
                className="px-8 py-3 border-2 border-cyan-500 dark:border-cyan-400 text-cyan-500 dark:text-cyan-400 rounded-full font-semibold hover:bg-cyan-500/10 transition-colors"
              >
                View Portfolio
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Services</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive web development solutions tailored to your needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-2xl glass"
            >
              <div className="mb-4 text-cyan-500 dark:text-cyan-400">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A selection of my best work showcasing modern web development
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              alt="Project 1"
              className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">E-Commerce Platform</h3>
                <p className="text-gray-200">Modern shopping experience with React and Node.js</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="relative group overflow-hidden rounded-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80"
              alt="Project 2"
              className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
                <p className="text-gray-200">Data visualization with real-time updates</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            What clients say about working with FrontEndFix
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl glass"
          >
            <div className="flex gap-1 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              "Working with FrontEndFix was an absolute pleasure. They delivered a beautiful, responsive website that exceeded our expectations."
            </p>
            <div>
              <p className="font-semibold">Sarah Johnson</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">CEO, TechStart</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl glass"
          >
            <div className="flex gap-1 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              "The attention to detail and technical expertise shown by FrontEndFix helped us create a website that truly stands out."
            </p>
            <div>
              <p className="font-semibold">Michael Chen</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Founder, DesignLab</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}