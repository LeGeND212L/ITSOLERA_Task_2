import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchServices } from '../redux/slices/serviceSlice';
import {
  FiArrowRight,
  FiCode,
  FiShield,
  FiZap,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { services } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices({ limit: 2, sort: '-createdAt' }));
  }, [dispatch]);

  const latestServices = services.slice(0, 2);

  const features = [
    {
      icon: FiCode,
      title: 'Tech Services',
      description: 'Access a wide range of professional tech services from verified providers.',
    },
    {
      icon: FiCalendar,
      title: 'Easy Booking',
      description: 'Book services with just a few clicks and manage all your appointments.',
    },
    {
      icon: FiShield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
    {
      icon: FiZap,
      title: 'Fast & Reliable',
      description: 'Quick response times and reliable service delivery guaranteed.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Services' },
    { value: '1000+', label: 'Customers' },
    { value: '100+', label: 'Providers' },
    { value: '99%', label: 'Satisfaction' },
  ];

  const categories = [
    { icon: '🌐', name: 'Web Development', value: 'web-development', color: 'from-blue-500 to-cyan-500' },
    { icon: '📱', name: 'Mobile Apps', value: 'mobile-development', color: 'from-purple-500 to-pink-500' },
    { icon: '🎨', name: 'UI/UX Design', value: 'ui-ux-design', color: 'from-orange-500 to-red-500' },
    { icon: '☁️', name: 'Cloud Services', value: 'cloud-services', color: 'from-sky-500 to-indigo-500' },
    { icon: '🤖', name: 'AI & ML', value: 'ai-ml', color: 'from-emerald-500 to-teal-500' },
    { icon: '🔒', name: 'Cybersecurity', value: 'cybersecurity', color: 'from-red-500 to-rose-500' },
  ];

  return (
    <div className="bg-dark-950">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-500/5 via-transparent to-dark-950" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-500/10 border border-cyber-500/20 rounded-full text-cyber-400 text-sm mb-8 animate-fade-in">
              <FiZap className="w-4 h-4" />
              Apex Booking - Smart Service Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
              Book Professional{' '}
              <span className="gradient-text">Services</span>{' '}
              with Apex Booking
            </h1>
            
            <p className="text-lg md:text-xl text-dark-300 mb-10 max-w-2xl mx-auto animate-slide-up">
              Connect with verified service providers, book appointments seamlessly, 
              and manage everything from one powerful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link to="/services" className="btn-primary btn-lg">
                Browse Services
                <FiArrowRight />
              </Link>
              {!isAuthenticated && (
                <Link to="/register?role=provider" className="btn-outline btn-lg">
                  Become a Provider
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Popular Categories</h2>
            <p className="section-subtitle">Explore our most requested service categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.value}
                to={`/services?category=${category.value}`}
                className="card-hover text-center group transition-transform hover:scale-105"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:shadow-lg transition-all`}>
                  {category.icon}
                </div>
                <h3 className="text-white font-medium text-sm group-hover:text-cyber-400 transition-colors">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Services */}
      {latestServices.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title">Latest Services</h2>
                <p className="section-subtitle">Newly added professional services</p>
              </div>
              <Link to="/services" className="btn-secondary hidden sm:flex hover:scale-105 transition-transform">
                View All Services
                <FiArrowRight />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {latestServices.map((service) => {
                const categoryIcons = {
                  'web-development': '🌐',
                  'mobile-development': '📱',
                  'ui-ux-design': '🎨',
                  'cloud-services': '☁️',
                  'ai-ml': '🤖',
                  'cybersecurity': '🔒',
                  'data-analytics': '📊',
                  'consulting': '💼',
                  'maintenance': '🔧',
                  'other': '📦'
                };
                
                return (
                  <Link
                    key={service._id}
                    to={`/services/${service._id}`}
                    className="card-hover group transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:from-cyber-500/30 group-hover:to-primary-500/30 transition-all group-hover:scale-110 group-hover:shadow-lg">
                        {categoryIcons[service.category] || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyber-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-dark-400 text-sm line-clamp-2 mb-4">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <FiDollarSign className="w-4 h-4" />
                            <span>${service.price}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-dark-400">
                            <FiClock className="w-4 h-4" />
                            <span>{service.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-dark-400">
                            <FiUsers className="w-4 h-4" />
                            <span>{service.providerId?.name || 'Provider'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link to="/services" className="btn-secondary">
                View All Services
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Apex Booking?</h2>
            <p className="section-subtitle">Everything you need in one platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-hover group transition-all hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-cyber-500/30 group-hover:to-primary-500/30 transition-all group-hover:shadow-lg">
                  <feature.icon className="w-7 h-7 text-cyber-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyber-400 transition-colors">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in just 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse Services', desc: 'Explore our catalog of professional tech services' },
              { step: '02', title: 'Book Appointment', desc: 'Select a time slot that works for you' },
              { step: '03', title: 'Get Service', desc: 'Receive quality service from verified providers' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center group">
                <div className="text-6xl font-bold text-dark-800 mb-4 group-hover:text-cyber-500 transition-colors">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyber-400 transition-colors">{item.title}</h3>
                <p className="text-dark-400">{item.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-dark-600 group-hover:translate-x-2 transition-transform">
                    <FiArrowRight className="w-8 h-8 group-hover:text-cyber-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card bg-gradient-to-r from-cyber-500/10 to-primary-500/10 border-cyber-500/20 hover:border-cyber-500/40 transition-all">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
              Join thousands of satisfied customers and service providers on Apex Booking today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary btn-lg hover:scale-105 transition-transform">
                Create Free Account
                <FiArrowRight />
              </Link>
              <Link to="/services" className="btn-secondary btn-lg hover:scale-105 transition-transform">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
