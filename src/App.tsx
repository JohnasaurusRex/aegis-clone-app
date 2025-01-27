import { useState, Suspense, lazy } from 'react';
import { Search } from 'lucide-react';
import { analyzeToken, AnalysisResponse, isDataComplete } from './services/api';

// Lazy load the AnalysisView component
const AnalysisView = lazy(() => import('./components/AnalysisView'));

const App = () => {
  const [address, setAddress] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);
    setAnalysisData(null); // Reset analysis data before new request

    try {
      // Initial fetch to start analysis
      const response = await analyzeToken(address);
      
      if (!response.requestId) {
        setError('Analysis initialization failed. Please try again.');
        return;
      }

      // Set initial data
      setAnalysisData(response);
      
      // Start polling if data is not complete
      if (!isDataComplete(response)) {
        await pollAnalysisData(response.requestId);
      }
    } catch (err) {
      setError('Failed to analyze token. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pollAnalysisData = async (requestId: string) => {
    try {
      const pollInterval = setInterval(async () => {
        // Simulate polling logic here
        const updatedData = await analyzeToken(requestId); // Replace with actual polling logic
        setAnalysisData(updatedData);

        if (isDataComplete(updatedData)) {
          clearInterval(pollInterval);
        }
      }, 2000);

      // Clear interval after 30 seconds to prevent infinite polling
      setTimeout(() => {
        clearInterval(pollInterval);
        if (analysisData && !isDataComplete(analysisData)) {
          setError('Analysis timed out. Please try again.');
        }
      }, 30000);
    } catch (error) {
      console.error('Polling error:', error);
      setError('Error updating analysis. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#111824] to-black">
      <div className="flex flex-col items-center pt-20 px-4">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-blue-400 text-6xl font-bold">AEGIS</h1>
          <span className="text-blue-400 text-sm px-2 py-1 rounded bg-blue-400/10 h-fit relative -top-1">CLONE</span>
        </div>

        <h2 className="text-slate-300 text-xl mb-12 text-center">
          AI Enabled Gateway for Intelligent Solana Operation
        </h2>

        <div className="w-full max-w-2xl">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Enter a Solana token address for ai"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-800/50 text-slate-300 py-3 pl-10 pr-4 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={loading || !address}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-600/50"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {error && (
            <p className="text-red-400 mt-2">{error}</p>
          )}
        </div>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-7xl mx-auto px-4 mt-8">
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-slate-800/50 rounded-xl"></div>
            <div className="h-96 bg-slate-800/50 rounded-xl"></div>
          </div>
        </div>
      }>
        {analysisData && <AnalysisView data={analysisData} />}
      </Suspense>
    </div>
  );
};

export default App;