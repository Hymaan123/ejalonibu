import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: 'USD' | 'NGN';
  setCurrency: (currency: 'USD' | 'NGN') => void;
  exchangeRate: number;
  convertPrice: (amount: number, from: 'USD' | 'NGN', to?: 'USD' | 'NGN') => number;
  formatPrice: (amount: number, currency?: 'USD' | 'NGN') => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [exchangeRate, setExchangeRate] = useState(1600); // 1 USD = 1600 NGN

  // Simulate real-time exchange rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small fluctuations in exchange rate
      const fluctuation = (Math.random() - 0.5) * 20; // ±10 NGN fluctuation
      setExchangeRate(prev => Math.max(1580, Math.min(1620, prev + fluctuation)));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const convertPrice = (amount: number, from: 'USD' | 'NGN', to?: 'USD' | 'NGN'): number => {
    const targetCurrency = to || currency;
    
    if (from === targetCurrency) return amount;
    
    if (from === 'USD' && targetCurrency === 'NGN') {
      return amount * exchangeRate;
    }
    
    if (from === 'NGN' && targetCurrency === 'USD') {
      return amount / exchangeRate;
    }
    
    return amount;
  };

  const formatPrice = (amount: number, curr?: 'USD' | 'NGN'): string => {
    const targetCurrency = curr || currency;
    
    if (targetCurrency === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      exchangeRate,
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyProvider;