import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchPendingProviders, approveProvider, rejectProvider } from '../../redux/slices/adminSlice';
import Loader from '../../components/common/Loader';

const AdminProviders = () => {
  const dispatch = useDispatch();
  const { pendingProviders, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPendingProviders());
  }, [dispatch]);

  const handleApprove = async (id) => {
    const result = await dispatch(approveProvider(id));
    if (approveProvider.fulfilled.match(result)) {
      toast.success('Provider approved successfully');
    } else {
      toast.error(result.payload || 'Failed to approve provider');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject and remove this provider?')) {
      const result = await dispatch(rejectProvider(id));
      if (rejectProvider.fulfilled.match(result)) {
        toast.success('Provider rejected and removed');
      } else {
        toast.error(result.payload || 'Failed to reject provider');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Provider Approvals</h1>
        <p className="text-dark-400">Review and approve pending service providers</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading providers..." />
        </div>
      ) : pendingProviders.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
          <p className="text-dark-400">No pending provider approvals at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingProviders.map((provider) => (
            <div key={provider._id} className="card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyber-500 to-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">
                    {provider.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                  <p className="text-dark-400">{provider.email}</p>
                  {provider.phone && (
                    <p className="text-dark-400 text-sm">Phone: {provider.phone}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-dark-400">
                    <FiClock className="w-4 h-4" />
                    Applied {new Date(provider.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(provider._id)}
                    className="btn-success flex-1 sm:flex-initial"
                  >
                    <FiCheck />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(provider._id)}
                    className="btn-danger flex-1 sm:flex-initial"
                  >
                    <FiX />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProviders;
