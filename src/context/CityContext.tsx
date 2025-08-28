import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Location } from '../types';

// City Context State
interface CityState {
  selectedLocation: Location;
  isLoading: boolean;
}

// City Context Actions
type CityAction = 
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'SET_LOADING'; payload: boolean };

// Default location
const defaultLocation: Location = {
  id: 'ahmedabad',
  name: 'Ahmedabad',
  city: 'Ahmedabad',
};

// Initial state
const initialState: CityState = {
  selectedLocation: defaultLocation,
  isLoading: false,
};

// Reducer function
const cityReducer = (state: CityState, action: CityAction): CityState => {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        selectedLocation: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context type
interface CityContextType {
  state: CityState;
  setLocation: (location: Location) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create context
const CityContext = createContext<CityContextType | undefined>(undefined);

// Provider component
interface CityProviderProps {
  children: ReactNode;
}

export const CityProvider: React.FC<CityProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cityReducer, initialState);

  const setLocation = (location: Location) => {
    dispatch({ type: 'SET_LOCATION', payload: location });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  };

  return (
    <CityContext.Provider
      value={{
        state,
        setLocation,
        setLoading,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

// Custom hook to use the city context
export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

// Export types
export type { CityState, CityAction };
