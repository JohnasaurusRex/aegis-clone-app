export const API_BASE_URL = 'https://aegis-clone-api.vercel.app/api';

export interface TokenData {
  token_name: string;
  token_symbol: string;
  token_address: string;
  quote_token_symbol: string;
  market_cap: number;
  price_change_24h: number;
  liquidity: number;
  volume_24h: number;
  volume_market_cap_ratio: number;
  price_usd: number;
  graph_url: string;
  trust_score: number;
  market_cap_score: number;
  liquidity_score: number;
  volume_score: number;
  risk_level: string;
  social_scores: SocialScores;
}

export interface SocialScores {
  sentiment_score: number;
  community_trust_score: number;
  trending_score: number;
}

export interface AnalysisResponse {
  token_data: TokenData;
  market_analysis: string;
  social_analysis: string;
  market_scores: {
    trust_score: number;
    market_cap_score: number;
    liquidity_score: number;
    volume_score: number;
  };
  social_scores: SocialScores;
  risk_level: string;
  status: string;
  requestId: string;
  isComplete: boolean;
  error?: string;
}

export const analyzeToken = async (address: string): Promise<AnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Analysis failed');
    }

    return data;
  } catch (error) {
    console.error('Error analyzing token:', error);
    throw error;
  }
};

export const isDataComplete = (data: AnalysisResponse): boolean => {
  return !!(
    data.market_scores &&
    data.social_scores &&
    data.market_analysis &&
    data.social_analysis &&
    data.isComplete
  );
};