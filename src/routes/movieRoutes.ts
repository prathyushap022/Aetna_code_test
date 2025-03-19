import express from 'express';
import movieController from '../controllers/movieController';

const router = express.Router();

// @route /api/movies
router.get('/', movieController.getAllMovies);

// @route /api/movies/:movieId
router.get('/:id', movieController.getMovieById);

// @route /api/movies/year/:year
router.get('/year/:year', movieController.getMoviesByYear);

// @route /api/movies/genre/:genre
router.get('/genre/:genre', movieController.getMoviesByGenre);

export default router;
