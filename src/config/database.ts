import sqlite3 from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Database paths from environment variables
const moviesDbPath = process.env.MOVIES_DB_PATH || path.join(__dirname, '../../db/movies.db');
const ratingsDbPath = process.env.RATINGS_DB_PATH || path.join(__dirname, '../../db/ratings.db');

// Connect to databases
const moviesDb = new sqlite3.Database(moviesDbPath, (err) => {
  if (err) {
    console.error('Error connecting to the movies database:', err.message);
  } else {
    console.log('Connected to the movies database.');
  }
});

const ratingsDb = new sqlite3.Database(ratingsDbPath, (err) => {
  if (err) {
    console.error('Error connecting to the ratings database:', err.message);
  } else {
    console.log('Connected to the ratings database.');
  }
});

// Helper function to run queries with promises
const runQuery = <T>(db: sqlite3.Database, query: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
};

// Helper to get a single row
const getOne = <T>(db: sqlite3.Database, query: string, params: any[] = []): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject(err);
      } else {
        resolve(row as T || null);
      }
    });
  });
};

// Close database connections on process exit
process.on('SIGINT', () => {
  moviesDb.close((err) => {
    if (err) {
      console.error('Error closing movies database:', err.message);
    } else {
      console.log('Movies database connection closed.');
    }
  });
  
  ratingsDb.close((err) => {
    if (err) {
      console.error('Error closing ratings database:', err.message);
    } else {
      console.log('Ratings database connection closed.');
    }
  });
  
  process.exit(0);
});

export {
  moviesDb,
  ratingsDb,
  runQuery,
  getOne
};
