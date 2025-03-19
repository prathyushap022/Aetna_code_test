import { Request, Response } from 'express';
import movieService from '../services/movieService';

class MovieController {
  async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getAllMovies(page);
      
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Failed to fetch movies' });
    }
  }

  async getMovieById(req: Request, res: Response): Promise<void> {
    try {
      const movie = await movieService.getMovieById(req.params.id);
      
      if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
      
      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Failed to fetch movie details' });
    }
  }

  async getMoviesByYear(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.params.year);
      
      if (isNaN(year) || year < 1888 || year > 2030) {
        res.status(400).json({ error: 'Invalid year parameter' });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const order = (req.query.order as string) || 'asc';
      
      if (order !== 'asc' && order !== 'desc') {
        res.status(400).json({ error: 'Sort order must be "asc" or "desc"' });
        return;
      }
      
      const movies = await movieService.getMoviesByYear(year, page, order);
      
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies by year:', error);
      res.status(500).json({ error: 'Failed to fetch movies by year' });
    }
  }

  async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    try {
      const genre = req.params.genre;
      
      if (!genre) {
        res.status(400).json({ error: 'Genre parameter is required' });
        return;
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const movies = await movieService.getMoviesByGenre(genre, page);
      
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      res.status(500).json({ error: 'Failed to fetch movies by genre' });
    }
  }
}

export default new MovieController();
