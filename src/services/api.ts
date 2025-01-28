// Configuration management for API endpoints
export const ApiConfig = {
  // Development configuration
  development: {
    BASE_URL: 'http://localhost:5000/api'
  },

  // Production configuration
  production: {
    BASE_URL: 'https://aegis-clone-api.vercel.app/api'
  },

  // Get current configuration (can be switched easily)
  getConfig() {
    // Toggle this or use environment variable
    return this.production; // Change to this.production for deployment
    // Or use environment variable:
    // return process.env.NODE_ENV === 'production' ? this.production : this.development
  }
};

// Existing interfaces remain the same
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
  const config = ApiConfig.getConfig();

  try {
    const response = await fetch(`${config.BASE_URL}/analyze`, {
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

export const sendChatMessage = async (
  message: string,
  tokenAddress: string,
  requestId: string
): Promise<{ response: string; timestamp: number }> => {
  try {
    const config = ApiConfig.getConfig();
    const response = await fetch(`${config.BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        token_address: tokenAddress,
        request_id: requestId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const pollAnalysisStatus = async (requestId: string): Promise<AnalysisResponse> => {
  const config = ApiConfig.getConfig();

  try {
    const response = await fetch(`${config.BASE_URL}/status/${requestId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch analysis status');
    }

    return data;
  } catch (error) {
    console.error('Error polling analysis status:', error);
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