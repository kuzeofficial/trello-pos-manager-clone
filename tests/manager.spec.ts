import { expect, test } from 'vitest'
import { TrelloManager } from '../src/manager'
import type { Card, Column } from '../src/types'

test('TrelloManager - get', () => {
    const columns: Column[] = [{ id: '1', cards: [] }]
    const manager = new TrelloManager(columns)
    const result = manager.get()
    console.log(result.get('1'))
    expect(result.get('1')).toBe(columns[0])
})

test('TrelloManager - addCard', () => {
    const columns: Column[] = [{ id: '1', cards: [] }]
    const manager = new TrelloManager(columns)
    const newCard: Card = { id: '1', pos: 0 }
    manager.addCard('1', newCard)
    const result = manager.get()
    expect(result.get('1')?.cards[0]).toBe(newCard)
})

test('TrelloManager - moveCard', () => {
  const card1: Card = { id: '1', pos: 0 }
  const card2: Card = { id: '2', pos: 16384 }
  const columns: Column[] = [
    { id: '1', cards: [card1] },
    { id: '2', cards: [card2] }
  ]
  const manager = new TrelloManager(columns)
  manager.moveCard('1', '2', '1')
  const result = manager.get()
  expect(result.get('1')?.cards.length).toBe(0)
  expect(result.get('2')?.cards[0]).toBe(card1)
  expect(result.get('2')?.cards[1]).toBe(card2)
})