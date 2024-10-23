'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NameContextType {
  defaultName: string;
  setDefaultName: (name: string) => void;
}

const NameContext = createContext<NameContextType | undefined>(undefined);

export const NameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [defaultName, setDefaultName] = useState<string>('');

  return (
    <NameContext.Provider value={{ defaultName, setDefaultName }}>
      {children}
    </NameContext.Provider>
  );
};

export const useNameContext = () => {
  const context = useContext(NameContext);
  if (context === undefined) {
    throw new Error('useNameContext must be used within a NameProvider');
  }
  return context;
};
