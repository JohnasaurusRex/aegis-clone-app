import React, { useState } from 'react';
import { TrendingUp, DollarSign, BarChart2, LineChart } from 'lucide-react';
import { AnalysisResponse } from '../services/api';

interface AnalysisViewProps {
  data: AnalysisResponse;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ data }) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const {
    token_data
  } = data;

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const renderContent = () => (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="bg-slate-800/30 rounded-xl p-6 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl text-white font-bold">{token_data.token_symbol}</h2>
              <span className="text-slate-400 text-sm">/{token_data.quote_token_symbol}</span>
            </div>
            <span className="text-slate-400 text-sm">{token_data.token_address}</span>
            <p className="text-slate-400 text-sm">{token_data.token_name}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-green-400 text-4xl font-bold">{data.market_scores?.trust_score}</p>
            <p className="text-slate-400 text-sm">Trust Score</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <DollarSign size={16} />
              <p>Market Cap</p>
            </div>
              <p className="text-white text-xl font-bold">{formatNumber(token_data.market_cap)}</p>
              <p className="text-slate-400 text-sm">Score: {data.market_scores?.market_cap_score}/100</p>
            </div>
          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <TrendingUp size={16} />
              <p>Price Trend</p>
            </div>
            <p className={`text-xl font-bold ${token_data.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {token_data.price_change_24h >= 0 ? 'Up' : 'Down'}
            </p>
            <p className="text-slate-400 text-sm">{token_data.price_change_24h}%</p>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <BarChart2 size={16} />
              <p>Liquidity</p>
            </div>
            <p className="text-white text-xl font-bold">{formatNumber(token_data.liquidity)}</p>
            <p className="text-slate-400 text-sm">Score: {data.market_scores?.liquidity_score}/100</p>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <LineChart size={16} />
              <p>24h Volume</p>
            </div>
            <p className="text-white text-xl font-bold">{formatNumber(token_data.volume_24h)}</p>
            <p className="text-slate-400 text-sm">Score: {data.market_scores?.volume_score}/100</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">Analysis Summary</h3>
          <div className="text-slate-300 leading-relaxed">
            <p>
              {showFullSummary ? data.market_analysis : `${data.market_analysis?.slice(0, 300)}...`}
            </p>
          </div>
          <button 
            onClick={() => setShowFullSummary(!showFullSummary)}
            className="text-blue-400 mt-4 hover:text-blue-300"
          >
            {showFullSummary ? 'Show Less' : 'Read More'}
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-white text-xl font-bold mb-4">Market Assessment</h3>
          <div className="p-4 bg-slate-900/80 rounded-lg space-y-4">
            <h4 className="text-blue-400 mb-4">Market Metrics</h4>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Price Trend</span>
              <span className={`${token_data.price_change_24h >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'} px-3 py-1 rounded-full font-bold`}>
                {token_data.price_change_24h >= 0 ? '↑' : '↓'} {Math.abs(token_data.price_change_24h)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Liquidity</span>
              <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full font-bold">
                {formatNumber(token_data.liquidity)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Trading Volume (24h)</span>
              <span className="text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full font-bold">
                {formatNumber(token_data.volume_24h)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Market Cap</span>
              <span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full font-bold">
                {formatNumber(token_data.market_cap)}
              </span>
            </div>
          </div>
          <p className="text-slate-300 mt-4 text-sm">
            With total liquidity of approximately {formatNumber(token_data.liquidity)}, ${token_data.token_symbol} is classified as 
            {token_data.liquidity > 1000000 ? ' low' : ' high'} risk, allowing for 
            regular trading activities{token_data.liquidity > 1000000 ? ' without significant' : ' with potential'} issues related to slippage or liquidity depth.
          </p>
        </div>

        <div>
          <h3 className="text-white text-xl font-bold mb-4">Social Metrics</h3>
          <div className="p-4 bg-slate-900/80 rounded-lg space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-yellow-400 text-2xl font-bold">
                  {data.social_scores?.sentiment_score}/100
                </p>
                <p className="text-slate-400 text-sm">Sentiment Score</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 text-2xl font-bold">
                  {data.social_scores?.community_trust_score}%
                </p>
                <p className="text-slate-400 text-sm">Community Trust</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 text-2xl font-bold">
                  {data.social_scores?.trending_score}/100
                </p>
                <p className="text-slate-400 text-sm">Trending Score</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {data.social_analysis}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Graph */}
      <div className="bg-slate-800/30 rounded-xl p-6 mb-10">
        <div className="h-[600px] w-full">
          {token_data.graph_url ? (
            <iframe
              src={token_data.graph_url}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              loading="lazy"
              title="Token Price Chart"
              allowFullScreen
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-slate-400">Graph Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderContent()}
    </>
  );
};

export default AnalysisView;