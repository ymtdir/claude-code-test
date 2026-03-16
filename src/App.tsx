import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppNavigator } from './navigation/AppNavigator';
import { useDatabase } from './hooks/useDatabase';
import { DatabaseMigration } from './utils/migration';
import { store, persistor } from './store';
import './App.css';

function App() {
  const { isInitialized, isLoading, error } = useDatabase();
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  useEffect(() => {
    // データベース初期化後にマイグレーションを実行
    if (isInitialized && !DatabaseMigration.isMigrationCompleted()) {
      DatabaseMigration.runMigration()
        .then((result) => {
          if (result.success) {
            setMigrationStatus(
              result.migratedCount > 0
                ? `Successfully migrated ${result.migratedCount} tasks`
                : 'Migration completed'
            );
          } else {
            setMigrationStatus(`Migration failed: ${result.error}`);
          }
        })
        .catch((err) => {
          setMigrationStatus(`Migration error: ${err.message}`);
        });
    }
  }, [isInitialized]);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading database...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        Database error: {error.message}
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Database not initialized
      </div>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          {migrationStatus && (
            <div
              style={{
                padding: '10px',
                backgroundColor: '#f0f0f0',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              {migrationStatus}
            </div>
          )}
          <AppNavigator />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
