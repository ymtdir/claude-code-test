import { UnifiedCalDatabase } from './db';

// Create a singleton instance of the database
export const db = new UnifiedCalDatabase();

// Export database class for type information
export { UnifiedCalDatabase } from './db';

// Export schemas and models
export * from './schema';
export * from './models';

// Initialize database on app start
export async function initializeDatabase(): Promise<void> {
  try {
    // Open database connection
    await db.open();

    // Seed initial data if needed
    await db.seedInitialData();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Clean up database connection
export async function closeDatabase(): Promise<void> {
  try {
    db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Failed to close database:', error);
  }
}
