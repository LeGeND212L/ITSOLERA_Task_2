import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiClock, FiDollarSign, FiUser, FiGrid, FiList } from 'react-icons/fi';
import { fetchServices, fetchCategories } from '../../redux/slices/serviceSlice';
import Loader from '../../components/common/Loader';

const ServiceCard = ({ service, viewMode }) => {
  const categoryIcons = {
    'web-development': '🌐',
    'mobile-development': '📱',
    'ui-ux-design': '🎨',
    'cloud-services': '☁️',
    'data-analytics': '📊',
    'cybersecurity': '🔒',
    'ai-ml': '🤖',
    'consulting': '💼',
    'maintenance': '🔧',
    'other': '📦',
  };

  if (viewMode === 'grid') {
    return (
      <Link to={`/services/${service._id}`} className="card-hover group block h-full transition-all hover:scale-[1.02]">
        <div className="flex flex-col h-full">
          <div className="w-full h-32 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-t-xl flex items-center justify-center text-4xl group-hover:from-cyber-500/30 group-hover:to-primary-500/30 transition-all group-hover:shadow-lg">
            {categoryIcons[service.category] || '📦'}
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-cyber-400 transition-colors">
              {service.title}
            </h3>
            <p className="text-dark-400 text-sm line-clamp-3 mb-4 flex-1">
              {service.description}
            </p>
            <div className="space-y-2 text-sm pt-3 border-t border-dark-700 group-hover:border-cyber-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-dark-400">Price:</span>
                <span className="text-emerald-400 font-semibold">${service.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-400">Duration:</span>
                <span className="text-white">{service.duration} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-400">Provider:</span>
                <span className="text-white truncate ml-2">{service.providerId?.name || 'Provider'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/services/${service._id}`} className="card-hover group block transition-all hover:scale-[1.01]">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:from-cyber-500/30 group-hover:to-primary-500/30 transition-all group-hover:shadow-lg group-hover:scale-110">
          {categoryIcons[service.category] || '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1 truncate group-hover:text-cyber-400 transition-colors">
            {service.title}
          </h3>
          <p className="text-dark-400 text-sm line-clamp-2 mb-3">
            {service.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <FiDollarSign className="w-4 h-4" />
              <span>${service.price}</span>
            </div>
            <div className="flex items-center gap-1.5 text-dark-400">
              <FiClock className="w-4 h-4" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-dark-400">
              <FiUser className="w-4 h-4" />
              <span>{service.providerId?.name || 'Provider'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  const dispatch = useDispatch();
  const { services, categories, loading, pagination } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Dynamic search - debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      
      // Only update if the search param actually changed
      if (params.toString() !== searchParams.toString()) {
        setSearchParams(params, { replace: true });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      page: searchParams.get('page') || 1,
      limit: 100, // Show all services on one page
    };
    dispatch(fetchServices(params));
  }, [dispatch, searchParams]);

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-dark-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Browse Services</h1>
            <p className="text-dark-400">Find the perfect service for your needs</p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-2 bg-dark-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:scale-105 ${
                viewMode === 'list'
                  ? 'bg-cyber-500/20 text-cyber-400'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <FiList className="w-5 h-5" />
              <span className="font-medium">List</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all hover:scale-105 ${
                viewMode === 'grid'
                  ? 'bg-cyber-500/20 text-cyber-400'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <FiGrid className="w-5 h-5" />
              <span className="font-medium">Grid</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services... (type to search)"
                className="input pl-11 hover:border-cyber-500/50 focus:border-cyber-500 transition-colors"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary lg:hidden hover:scale-105 transition-transform"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all hover:scale-[1.02] ${
                    !selectedCategory
                      ? 'bg-cyber-500/20 text-cyber-400'
                      : 'text-dark-300 hover:bg-dark-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all hover:scale-[1.02] flex items-center gap-2 ${
                      selectedCategory === cat.value
                        ? 'bg-cyber-500/20 text-cyber-400'
                        : 'text-dark-300 hover:bg-dark-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader size="lg" text="Loading services..." />
              </div>
            ) : services.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
                <p className="text-dark-400 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                    setSearchParams({});
                  }}
                  className="btn-primary btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results count */}
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-dark-400 text-sm">
                    Showing <span className="text-white font-medium">{services.length}</span> services
                    {pagination && pagination.total && (
                      <> out of <span className="text-white font-medium">{pagination.total}</span> total</>
                    )}
                  </p>
                  
                  {/* Mobile view toggle */}
                  <div className="flex sm:hidden items-center gap-2 bg-dark-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'list' ? 'bg-cyber-500/20 text-cyber-400' : 'text-dark-400'
                      }`}
                    >
                      <FiList className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'grid' ? 'bg-cyber-500/20 text-cyber-400' : 'text-dark-400'
                      }`}
                    >
                      <FiGrid className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Services Display */}
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'grid gap-4'
                }>
                  {services.map((service) => (
                    <ServiceCard key={service._id} service={service} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pagination.page === page
                            ? 'bg-cyber-500 text-white'
                            : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
