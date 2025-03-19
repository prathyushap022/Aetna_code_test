import dotenv from 'dotenv';
import { PaginationMetadata, PaginationParams } from '../types';

dotenv.config();

export const getPaginationMetadata = (
  page: number, 
  totalItems: number, 
  pageSize: number = parseInt(process.env.PAGE_SIZE || '50')
): PaginationMetadata => {
  const currentPage = Math.max(1, page);
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    currentPage,
    totalItems,
    pageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};

// Calculate SQL pagination parameters
export const getPaginationParams = (
  page: number = 1, 
  pageSize: number = parseInt(process.env.PAGE_SIZE || '50')
): PaginationParams => {
  const limit = pageSize;
  const offset = (Math.max(1, page) - 1) * pageSize;
  
  return { limit, offset };
};
