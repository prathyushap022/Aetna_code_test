export interface Movie {
    imdb_id: string;
    title: string;
    genres: string;
    release_date: string;
    budget: number | string;
  }
  
  export interface MovieDetail extends Movie {
    description: string;
    runtime: number;
    original_language: string;
    production_companies: string;
    average_rating?: number | string;
  }
  
  export interface CountResult {
    count: number;
  }
  
  export interface PaginationMetadata {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export interface PaginationParams {
    limit: number;
    offset: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMetadata;
  }
