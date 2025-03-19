import movieModel from '../models/movieModel';
import { getPaginationMetadata } from '../utils/pagination';
import { Movie, MovieDetail, PaginatedResponse } from '../types';

class MovieService {
  // Format movie budget to dollar format
  formatMovieBudget<T extends Movie | MovieDetail>(movie: T): T {
    if (movie) {
      const budget = typeof movie.budget === 'string' ? parseInt(movie.budget) : movie.budget;
      movie.budget = budget && !isNaN(budget) ? `$${budget.toLocaleString('en-US')}` : 'Unknown';
    }
    return movie;
  }
  
  // Format movie budgets for an array of movies
  formatMovieBudgets<T extends Movie | MovieDetail>(movies: T[]): T[] {
    return movies.map(movie => this.formatMovieBudget({...movie}));
  }

  // Get all movies with pagination
  async getAllMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
    const totalCount = await movieModel.getTotalMoviesCount();
    const movies = await movieModel.getAllMovies(page);
    
    return {
      data: this.formatMovieBudgets(movies),
      pagination: getPaginationMetadata(page, totalCount)
    };
  }

 // Get movie details by movieId
  async getMovieById(id: string): Promise<MovieDetail | null> {
    const movie = await movieModel.getMovieById(id);
    
    if (!movie) {
      return null;
    }
    
    return this.formatMovieBudget(movie);
  }

  // Get movies by release year
  async getMoviesByYear(year: number, page: number = 1, order: string = 'asc'): Promise<PaginatedResponse<Movie>> {
    const totalCount = await movieModel.getMoviesByYearCount(year);
    const movies = await movieModel.getMoviesByYear(year, page, order);
    
    return {
      data: this.formatMovieBudgets(movies),
      pagination: getPaginationMetadata(page, totalCount)
    };
  }

  // Get movies by genre
  async getMoviesByGenre(genre: string, page: number = 1): Promise<PaginatedResponse<Movie>> {
    const totalCount = await movieModel.getMoviesByGenreCount(genre);
    const movies = await movieModel.getMoviesByGenre(genre, page);
    
    return {
      data: this.formatMovieBudgets(movies),
      pagination: getPaginationMetadata(page, totalCount)
    };
  }
}

export default new MovieService();
