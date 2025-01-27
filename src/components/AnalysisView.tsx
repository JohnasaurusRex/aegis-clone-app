import { useState, memo, useCallback } from 'react';
import { TrendingUp, DollarSign, BarChart2, LineChart, X } from 'lucide-react';
import ChatContainer from '../components/ChatContainer'; 

// Memoized loading shimmer component
const LoadingShimmer = memo(({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
));

// Memoized chart component to prevent unnecessary rerenders
interface ChartComponentProps {
  tokenAddress: string;
  onError: () => void;
}

const ChartComponent = memo(({ tokenAddress, onError }: ChartComponentProps) => {
  if (!tokenAddress) return null;
  
  return (
    <div className="relative w-full h-full p-4">
      <iframe
        src={`https://www.gmgn.cc/kline/sol/${tokenAddress}`}
        className="w-full h-full"
        frameBorder="0"
        loading="lazy"
        title="Token Price Chart"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        onError={onError}
      />
    </div>
  );
});

// Chat message component


interface AnalysisViewProps {
  data: {
    token_data?: {
      token_symbol?: string;
      token_address?: string;
      token_name?: string;
      market_cap?: number;
      price_change_24h?: number;
      liquidity?: number;
      volume_24h?: number;
    };
    market_analysis?: string;
    social_analysis?: string;
    market_scores?: {
      trust_score?: number;
      market_cap_score?: number;
      liquidity_score?: number;
      volume_score?: number;
    };
    social_scores?: {
      sentiment_score?: number;
      community_trust_score?: number;
      trending_score?: number;
    };
    requestId?: string;
  };
}

const AnalysisView = ({ data }: AnalysisViewProps) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [graphError, setGraphError] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  
  const { token_data } = data || {};
  const isLoading = !data?.market_analysis || !data?.social_analysis || !data?.social_scores;

  // Memoized formatter functions
  const formatNumber = useCallback((num: number) => {
    if (num === undefined || num === null) return '$0.00';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  }, []);

  const getScoreColor = useCallback((score: number) => {
    if (score === undefined || score === null) return 'text-slate-400';
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }, []);

  const safeValue = useCallback((value: number | undefined | null, defaultValue = 0) => {
    return value === undefined || value === null ? defaultValue : value;
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-8 bg-slate-800/30 rounded-xl p-6 mb-10">
        {/* Token Info Section */}
        <div className="flex items-center gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl text-white font-bold">{token_data?.token_symbol || 'Loading...'}</h2>
              <span className="text-slate-400 text-sm">/SOL</span>
            </div>
            <span className="text-slate-400 text-sm">{token_data?.token_address || 'Loading...'}</span>
            <p className="text-slate-400 text-sm">{token_data?.token_name || 'Loading...'}</p>
          </div>
          <div className="ml-auto text-right">
            <p className={`${getScoreColor(safeValue(data?.market_scores?.trust_score))} text-4xl font-bold`}>
              {safeValue(data?.market_scores?.trust_score, 0)}
            </p>
            <p className="text-slate-400 text-sm">Trust Score</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <DollarSign size={16} />
              <p>Market Cap</p>
            </div>
            <p className="text-white text-xl font-bold">
              {formatNumber(safeValue(token_data?.market_cap))}
            </p>
            <p className={`text-sm ${getScoreColor(safeValue(data?.market_scores?.market_cap_score))}`}>
              Score: {safeValue(data?.market_scores?.market_cap_score, 0)}/100
            </p>
          </div>
          
          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <TrendingUp size={16} />
              <p>Price Trend</p>
            </div>
            <p className={`text-xl font-bold ${safeValue(token_data?.price_change_24h, 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {safeValue(token_data?.price_change_24h, 0) >= 0 ? 'Up' : 'Down'}
            </p>
            <p className={safeValue(token_data?.price_change_24h, 0) >= 0 ? 'text-green-400' : 'text-red-400'}>
              {Math.abs(safeValue(token_data?.price_change_24h, 0)).toFixed(2)}%
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <BarChart2 size={16} />
              <p>Liquidity</p>
            </div>
            <p className="text-white text-xl font-bold">
              {formatNumber(safeValue(token_data?.liquidity))}
            </p>
            <p className={`text-sm ${getScoreColor(safeValue(data?.market_scores?.liquidity_score))}`}>
              Score: {safeValue(data?.market_scores?.liquidity_score, 0)}/100
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <LineChart size={16} />
              <p>24h Volume</p>
            </div>
            <p className="text-white text-xl font-bold">
              {formatNumber(safeValue(token_data?.volume_24h))}
            </p>
            <p className={`text-sm ${getScoreColor(safeValue(data?.market_scores?.volume_score))}`}>
              Score: {safeValue(data?.market_scores?.volume_score, 0)}/100
            </p>
          </div>
        </div>

        {/* Analysis Summary Section */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">Analysis Summary</h3>
          {isLoading ? (
            <div className="space-y-2">
              <LoadingShimmer className="h-4 w-full" />
              <LoadingShimmer className="h-4 w-11/12" />
              <LoadingShimmer className="h-4 w-10/12" />
            </div>
          ) : (
            <>
              <div className="text-slate-300 leading-relaxed">
                <p>
                  {showFullSummary 
                    ? data.market_analysis 
                    : `${data.market_analysis?.slice(0, 300)}...`}
                </p>
              </div>
              <button 
                onClick={() => setShowFullSummary(!showFullSummary)}
                className="text-blue-400 mt-4 hover:text-blue-300 transition-colors"
              >
                {showFullSummary ? 'Show Less' : 'Read More'}
              </button>
            </>
          )}
        </div>

        {/* Market Assessment Section */}
        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">Market Assessment</h3>
          <div className="p-4 bg-slate-900/80 rounded-lg space-y-4">
            <h4 className="text-blue-400 mb-4">Market Metrics</h4>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Price Trend</span>
              <span className={`${safeValue(token_data?.price_change_24h, 0) >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'} px-3 py-1 rounded-full font-bold`}>
                {safeValue(token_data?.price_change_24h, 0) >= 0 ? '↑' : '↓'} {Math.abs(safeValue(token_data?.price_change_24h, 0))}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Liquidity</span>
              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full font-bold">
                {formatNumber(safeValue(token_data?.liquidity))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Trading Volume (24h)</span>
              <span className="text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full font-bold">
                {formatNumber(safeValue(token_data?.volume_24h))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Market Cap</span>
              <span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full font-bold">
                {formatNumber(safeValue(token_data?.market_cap))}
              </span>
            </div>
              <div className="mt-4">
              {isLoading ? (
                <LoadingShimmer className="h-16 w-full" />
              ) : (
                <p className="text-slate-300 text-sm">
                  With total liquidity of approximately {formatNumber(safeValue(token_data?.liquidity))}, 
                  ${token_data?.token_symbol || 'the token'} is classified as 
                  {safeValue(token_data?.liquidity, 0) > 1000000 ? ' low' : ' high'} risk, allowing for 
                  regular trading activities
                  {safeValue(token_data?.liquidity, 0) > 1000000 ? ' without significant ' : ' with potential '} 
                  issues related to slippage or liquidity depth.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Metrics Section */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Social Metrics</h3>
          <div className="p-4 bg-slate-900/80 rounded-lg space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {isLoading ? (
                <>
                  <LoadingShimmer className="h-20" />
                  <LoadingShimmer className="h-20" />
                  <LoadingShimmer className="h-20" />
                </>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-yellow-400 text-2xl font-bold">
                      {safeValue(data?.social_scores?.sentiment_score, 0)}/100
                    </p>
                    <p className="text-slate-400 text-sm">Sentiment Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 text-2xl font-bold">
                      {safeValue(data?.social_scores?.community_trust_score, 0)}%
                    </p>
                    <p className="text-slate-400 text-sm">Community Trust</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 text-2xl font-bold">
                      {safeValue(data?.social_scores?.trending_score, 0)}/100
                    </p>
                    <p className="text-slate-400 text-sm">Trending Score</p>
                  </div>
                </>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <LoadingShimmer className="h-4 w-full" />
                <LoadingShimmer className="h-4 w-11/12" />
                <LoadingShimmer className="h-4 w-10/12" />
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed">
                {data.social_analysis}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Graph and Chat */}
      <div className="lg:col-span-4 bg-slate-800/30 rounded-xl mb-10 h-[calc(90vh-4rem)] flex flex-col">
        {/* Graph Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <span className="text-white font-semibold">Westley v1.1</span>
          <button 
            onClick={() => setIsFullscreen(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" />
            </svg>
          </button>
        </div>

        {/* Graph Content */}
        <div className="h-96">
          {graphError ? (
            <div className="h-full w-full flex items-center justify-center flex-col gap-4">
              <p className="text-slate-400">Unable to load graph</p>
              <button 
                onClick={() => setGraphError(false)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : token_data?.token_address ? (
            <ChartComponent 
              tokenAddress={token_data.token_address} 
              onError={() => setGraphError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <LoadingShimmer className="h-full w-full" />
            </div>
          )}
        </div>

        {/* Chat Section */}
        <ChatContainer 
          tokenAddress={token_data?.token_address}
          requestId={data.requestId}
          messages={messages}
          setMessages={setMessages}
        />
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[90vh] bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-md flex flex-col">
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
              <span className="text-white font-semibold">
                Price Chart - {token_data?.token_symbol || 'Loading...'}
              </span>
              <button 
                onClick={() => setIsFullscreen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1">
              {graphError ? (
                <div className="h-full w-full flex items-center justify-center flex-col gap-4">
                  <p className="text-slate-400">Unable to load graph</p>
                  <button 
                    onClick={() => setGraphError(false)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : token_data?.token_address && (
                <ChartComponent 
                  tokenAddress={token_data.token_address}
                  onError={() => setGraphError(true)}
                />
              )}
            </div>
            <ChatContainer 
              tokenAddress={token_data?.token_address}
              requestId={data.requestId}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AnalysisView);