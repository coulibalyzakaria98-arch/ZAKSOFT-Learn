import React, { createContext, useState, useContext, useMemo } from 'react';

// 1. Create the context
const LowDataModeContext = createContext();

// 2. Create the provider component
export const LowDataModeProvider = ({ children }) => {
  const [isLowDataMode, setIsLowDataMode] = useState(false);

  const toggleLowDataMode = () => {
    setIsLowDataMode(prevMode => !prevMode);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isLowDataMode,
    toggleLowDataMode
  }), [isLowDataMode]);

  return (
    <LowDataModeContext.Provider value={value}>
      {children}
    </LowDataModeContext.Provider>
  );
};

// 3. Create a custom hook for easy consumption
export const useLowDataMode = () => {
  const context = useContext(LowDataModeContext);
  if (context === undefined) {
    throw new Error('useLowDataMode must be used within a LowDataModeProvider');
  }
  return context;
};
