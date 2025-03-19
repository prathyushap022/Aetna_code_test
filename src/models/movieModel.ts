import { moviesDb, ratingsDb, runQuery, getOne } from '../config/database';
import { getPaginationParams } from '../utils/pagination';
import { Movie, MovieDetail, CountResult } from '../types';

class MovieModel {

  async getTotalMoviesCount(): Promise<number> {
    const countResult = await getOne<CountResult>(moviesDb, 'SELECT COUNT(*) as count FROM movies');
    return countResult?.count || 0;
  }

  async getMoviesByYearCount(year: number): Promise<number> {
    const countResult = await getOne<CountResult>(
      moviesDb, 
      'SELECT COUNT(*) as count FROM movies WHERE strftime("%Y", releaseDate) = ?',
      [year.toString()]
    );
    return countResult?.count || 0;
  }

  async getMoviesByGenreCount(genre: string): Promise<number> {
    const countResult = await getOne<CountResult>(
      moviesDb, 
      'SELECT COUNT(*) as count FROM movies WHERE genres LIKE ?',
      [`%${genre}%`]
    );
    return countResult?.count || 0;
  }

  async getAllMovies(page: number = 1): Promise<Movie[]> {
    const { limit, offset } = getPaginationParams(page);
    
    const query = `
      SELECT 
        imdbId as imdb_id, 
        title, 
        genres, 
        releaseDate, 
        budget
      FROM movies
      LIMIT ? OFFSET ?
    `;
    
   const result = await runQuery<Movie>(moviesDb, query, [limit, offset]);
   return result;
  }

  async getMovieById(id: string): Promise<MovieDetail | null> {
    const movieQuery = `
      SELECT 
        imdbId as imdb_id, 
        title, 
        overview as description, 
        releaseDate as release_date, 
        budget, 
        runtime, 
        genres, 
        language as original_language, 
        productionCompanies as production_companies
      FROM movies
      WHERE movieId = ?
    `;
    
    const movie = await getOne<MovieDetail>(moviesDb, movieQuery, [id]);
    
    if (!movie) {
      return null;
    }
    
    // Get average rating from ratings database
    const ratingQuery = `
      SELECT AVG(rating) as average_rating
      FROM ratings
      WHERE movieId = ?
    `;
    
    const rating = await getOne<{ average_rating: number }>(ratingsDb, ratingQuery, [id]);
    
    if (rating && rating.average_rating) {
      movie.average_rating = parseFloat(rating.average_rating.toFixed(1));
    } else {
      movie.average_rating = 'No ratings available';
    }
    
    return movie;
  }

  async getMoviesByYear(year: number, page: number = 1, order: string = 'asc'): Promise<Movie[]> {
    const { limit, offset } = getPaginationParams(page);
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    
    const query = `
      SELECT 
        imdbId as imdb_id, 
        title, 
        genres, 
        releaseDate as release_date, 
        budget
      FROM movies
      WHERE strftime("%Y", releaseDate) = ?
      ORDER BY releaseDate ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    
    return runQuery<Movie>(moviesDb, query, [year.toString(), limit, offset]);
  }
  async getMoviesByGenre(genre: string, page: number = 1): Promise<Movie[]> {
    const { limit, offset } = getPaginationParams(page);
    
    const query = `
      SELECT 
        imdbId as imdb_id, 
        title, 
        genres, 
        releaseDate as release_date, 
        budget
      FROM movies
      WHERE genres LIKE ?
      ORDER BY releaseDate
      LIMIT ? OFFSET ?
    `;
    
    return runQuery<Movie>(moviesDb, query, [`%${genre}%`, limit, offset]);
  }
}

export default new MovieModel();
