export interface MovieQuote {
  quote: string;
  movie: string;
  year: number;
  character: string;
  difficulty: number;
}

// Import quotes from our data file
import quotesData from '../data/new-quotes.json';
export const movieQuotes: MovieQuote[] = quotesData; 