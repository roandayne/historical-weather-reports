import { useState, useCallback } from 'react';

export interface AlertState {
  type: 'success' | 'error';
  message: string;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = useCallback((type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  }, []);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return {
    alert,
    showAlert,
    clearAlert
  };
}; 