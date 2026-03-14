import { useEffect, useState } from 'react';
import { db, initializeDatabase } from '../database';

interface DatabaseState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to manage database initialization and connection
 */
export function useDatabase() {
  const [state, setState] = useState<DatabaseState>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const initDb = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Initialize database if not already open
        if (!db.isOpen()) {
          await initializeDatabase();
        }

        if (mounted) {
          setState({
            isInitialized: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Database initialization failed:', error);

        if (mounted) {
          setState({
            isInitialized: false,
            isLoading: false,
            error: error as Error,
          });
        }
      }
    };

    initDb();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  return {
    database: db,
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
    error: state.error,
    retry: async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        await initializeDatabase();
        setState({
          isInitialized: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          isInitialized: false,
          isLoading: false,
          error: error as Error,
        });
      }
    },
  };
}
