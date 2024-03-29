import type { Card as CardType } from './types/card';
import type { Column } from './types/column';

export class TrelloManager<T = {}> {
    private columnsMap: Map<string, Column<CardType<T>>>;

    constructor(columns: Column<CardType<T>>[]) {
        this.columnsMap = new Map(columns.map(column => [column.id, column]));
    }

    get() {
        return this.columnsMap;
    }

    addCard(columnId: string, newCard: CardType<T>) {
        const column = this.columnsMap.get(columnId);
        if (column) {
            const lastCard = column.cards[column.cards.length - 1];
            newCard.pos = lastCard ? lastCard.pos + 16384 : 16384;
            column.cards.push(newCard);
            return
        }
        console.error('Column not found');
    }

    moveCard(sourceColumnId: string, targetColumnId: string, cardId: string, newPosition?: number) {
        const sourceColumn = this.columnsMap.get(sourceColumnId);
        const targetColumn = this.columnsMap.get(targetColumnId);
        if (sourceColumn && targetColumn) {
            const movedCardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
            if (movedCardIndex !== -1) {
                const movedCard = sourceColumn.cards.splice(movedCardIndex, 1)[0];
                movedCard.pos = typeof newPosition !== 'undefined' ? newPosition : this.calculatePositionForMovedCard(targetColumn.cards, movedCardIndex);
                targetColumn.cards.push(movedCard);
                this.reorderCards(targetColumn.cards);
                return
            }
            console.error('Card not found in source column');
            return
        }
        console.error('Source or target column not found');
    }

    private calculatePositionForMovedCard(cards: CardType<T>[], movedCardIndex: number): number {
        if (cards.length === 0) {
            return 16384;
        }
        if (movedCardIndex === 0) {
            return cards[0].pos / 2;
        }
        if (movedCardIndex === cards.length) {
            return cards[movedCardIndex - 1].pos + 16384;
        }
        return (cards[movedCardIndex - 1].pos + cards[movedCardIndex].pos) / 2;
    }

    private reorderCards(cards: CardType<T>[]) {
        cards.sort((a, b) => a.pos - b.pos);
        for (let i = 0; i < cards.length - 1; i++) {
            if (Math.abs(cards[i].pos - cards[i + 1].pos) < 0.0001) {
                const average = (cards[i].pos + cards[i + 1].pos) / 2;
                cards[i].pos = average - 8192;
                cards[i + 1].pos = average + 8192;
            }
        }
    }
}