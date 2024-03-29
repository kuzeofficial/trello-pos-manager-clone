import type { Card } from './card';
export type Column<T = {}> = {
    id: string;
    cards: Card<T>[];
}