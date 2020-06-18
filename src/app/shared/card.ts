export interface ICard {
  id?: number;
  question: string;
  answer: string;
  tags: string[];
  date: string;
  success: number;
  user?: string;
}