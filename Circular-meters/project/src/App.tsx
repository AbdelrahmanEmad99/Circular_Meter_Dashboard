import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import CircularMeter from './components/CircularMeter';
import { fetchSatisfactionRatings } from './services/crmService';

function App() {
  const [customerSatisfaction, setCustomerSatisfaction] = useState(0);
  const [resolutionSatisfaction, setResolutionSatisfaction] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchSatisfactionRatings();
      setCustomerSatisfaction(data.customerSatisfaction);
      setResolutionSatisfaction(data.resolutionSatisfaction);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load satisfaction data from CRM');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('000000000');
     loadData();

     console.log('111111111');
    // const handleMessage = (event: MessageEvent) => {
    //   if (event.data === 'refreshMeters') {
    //     console.log('🔁 Refresh signal received from CRM!');
    //     loadData();
    //   }
    // };

    // window.addEventListener('message', handleMessage);

    // return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Satisfaction Metrics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time satisfaction ratings from CRM Dynamics
          </p>

          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <RefreshCw className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <CircularMeter
              value={customerSatisfaction}
              title="Customer Satisfaction"
              color="#3b82f6"
            />
            <CircularMeter
              value={resolutionSatisfaction}
              title="Resolution Satisfaction"
              color="#10b981"
            />
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
