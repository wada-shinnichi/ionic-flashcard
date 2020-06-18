import { ICard } from './card';

export interface IUser {
  username?: string;
  email: string;
  password: string;
  cards: ICard[];
}