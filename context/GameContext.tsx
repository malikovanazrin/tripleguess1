import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Round } from '@/constants/game';
import { pickCards, shuffle, Card } from '@/constants/cards';
import { Language } from '@/constants/translations';

export interface GameState {
  phase:
    | 'setup'
    | 'draft-intro'
    | 'drafting'
    | 'round-intro'
    | 'turn-start'
    | 'active-turn'
    | 'turn-summary'
    | 'round-end'
    | 'final';
  language: Language;
  cardCount: number;
  showDescriptions: boolean;
  draftingEnabled: boolean;
  numberOfPlayers: number;
  cardsPerPlayer: number;
  currentRound: Round;
  currentTeam: 1 | 2;
  scores: { team1: number; team2: number };
  originalCards: Card[];
  deckForRound: Card[];
  activeDeck: Card[];
  turnGuessedCards: Card[];
  lastTurnGuessedCount: number;
  // Drafting state
  draftPool: Card[];          // all cards dealt out (numberOfPlayers * 10)
  draftPlayerIndex: number;   // which player is currently drafting (0-based)
  draftPlayerCards: Card[][]; // 10 cards dealt to each player
  draftSelectedCards: Card[]; // cards selected by current player so far
  draftFinalDeck: Card[];     // accumulates all selected cards across all players
  draftRevealed: boolean;     // whether current player's cards are revealed
}

type Action =
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'START_GAME'; cardCount: number; showDescriptions: boolean; draftingEnabled: boolean; numberOfPlayers: number; cardsPerPlayer: number }
  | { type: 'START_DRAFT' }
  | { type: 'REVEAL_DRAFT_CARDS' }
  | { type: 'TOGGLE_DRAFT_CARD'; card: Card }
  | { type: 'SELECT_ALL_DRAFT' }
  | { type: 'DESELECT_ALL_DRAFT' }
  | { type: 'CONFIRM_DRAFT_SELECTION' }
  | { type: 'START_ROUND' }
  | { type: 'START_TURN' }
  | { type: 'CARD_GUESSED' }
  | { type: 'CARD_SKIPPED' }
  | { type: 'TURN_ENDED' }
  | { type: 'NEXT_TURN_OR_ROUND' }
  | { type: 'START_NEXT_ROUND' }
  | { type: 'RESET' };

const initialState: GameState = {
  phase: 'setup',
  language: 'en',
  cardCount: 40,
  showDescriptions: true,
  draftingEnabled: false,
  numberOfPlayers: 4,
  cardsPerPlayer: 10,
  currentRound: 1,
  currentTeam: 1,
  scores: { team1: 0, team2: 0 },
  originalCards: [],
  deckForRound: [],
  activeDeck: [],
  turnGuessedCards: [],
  lastTurnGuessedCount: 0,
  draftPool: [],
  draftPlayerIndex: 0,
  draftPlayerCards: [],
  draftSelectedCards: [],
  draftFinalDeck: [],
  draftRevealed: false,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_LANGUAGE': {
      return { ...state, language: action.language };
    }
    case 'START_GAME': {
      if (action.draftingEnabled) {
        // Deal 10 unique cards to each player
        const totalNeeded = action.numberOfPlayers * 10;
        const allCards = pickCards(totalNeeded, state.language);
        const playerCards: Card[][] = [];
        for (let i = 0; i < action.numberOfPlayers; i++) {
          playerCards.push(allCards.slice(i * 10, i * 10 + 10));
        }
        return {
          ...initialState,
          language: state.language,
          phase: 'draft-intro',
          cardCount: action.cardCount,
          showDescriptions: action.showDescriptions,
          draftingEnabled: true,
          numberOfPlayers: action.numberOfPlayers,
          cardsPerPlayer: action.cardsPerPlayer,
          currentTeam: 1,
          scores: { team1: 0, team2: 0 },
          draftPool: allCards,
          draftPlayerIndex: 0,
          draftPlayerCards: playerCards,
          draftSelectedCards: [],
          draftFinalDeck: [],
          draftRevealed: false,
        };
      } else {
        const cards = pickCards(action.cardCount, state.language);
        return {
          ...initialState,
          language: state.language,
          phase: 'round-intro',
          cardCount: action.cardCount,
          showDescriptions: action.showDescriptions,
          draftingEnabled: false,
          numberOfPlayers: action.numberOfPlayers,
          cardsPerPlayer: action.cardsPerPlayer,
          currentRound: 1,
          currentTeam: 1,
          scores: { team1: 0, team2: 0 },
          originalCards: cards,
          deckForRound: cards,
          activeDeck: [],
          turnGuessedCards: [],
          lastTurnGuessedCount: 0,
        };
      }
    }
    case 'START_DRAFT': {
      return { ...state, phase: 'drafting', draftRevealed: false, draftSelectedCards: [] };
    }
    case 'REVEAL_DRAFT_CARDS': {
      return { ...state, draftRevealed: true };
    }
    case 'TOGGLE_DRAFT_CARD': {
      const already = state.draftSelectedCards.find(c => c.name === action.card.name);
      if (already) {
        return { ...state, draftSelectedCards: state.draftSelectedCards.filter(c => c.name !== action.card.name) };
      }
      if (state.draftSelectedCards.length >= state.cardsPerPlayer) return state;
      return { ...state, draftSelectedCards: [...state.draftSelectedCards, action.card] };
    }
    case 'SELECT_ALL_DRAFT': {
      const currentCards = state.draftPlayerCards[state.draftPlayerIndex];
      const take = currentCards.slice(0, state.cardsPerPlayer);
      return { ...state, draftSelectedCards: take };
    }
    case 'DESELECT_ALL_DRAFT': {
      return { ...state, draftSelectedCards: [] };
    }
    case 'CONFIRM_DRAFT_SELECTION': {
      const newFinalDeck = [...state.draftFinalDeck, ...state.draftSelectedCards];
      const nextPlayerIndex = state.draftPlayerIndex + 1;
      if (nextPlayerIndex >= state.numberOfPlayers) {
        // All players done — start game with draft deck
        const finalDeck = shuffle(newFinalDeck);
        return {
          ...state,
          phase: 'round-intro',
          currentRound: 1,
          originalCards: finalDeck,
          deckForRound: finalDeck,
          activeDeck: [],
          turnGuessedCards: [],
          lastTurnGuessedCount: 0,
          draftFinalDeck: newFinalDeck,
          draftSelectedCards: [],
        };
      }
      return {
        ...state,
        draftPlayerIndex: nextPlayerIndex,
        draftSelectedCards: [],
        draftFinalDeck: newFinalDeck,
        draftRevealed: false,
      };
    }
    case 'START_ROUND': {
      return {
        ...state,
        phase: 'turn-start',
        activeDeck: shuffle([...state.deckForRound]),
        turnGuessedCards: [],
        lastTurnGuessedCount: 0,
      };
    }
    case 'START_TURN': {
      return {
        ...state,
        phase: 'active-turn',
        activeDeck: shuffle([...state.activeDeck]),
        turnGuessedCards: [],
      };
    }
    case 'CARD_GUESSED': {
      const [guessed, ...rest] = state.activeDeck;
      const newGuessed = [...state.turnGuessedCards, guessed];
      const teamKey = state.currentTeam === 1 ? 'team1' : 'team2';
      const newScores = { ...state.scores, [teamKey]: state.scores[teamKey] + 1 };
      const newDeckForRound = state.deckForRound.filter((c) => c.name !== guessed.name);
      if (rest.length === 0) {
        return { ...state, scores: newScores, activeDeck: [], deckForRound: newDeckForRound, turnGuessedCards: newGuessed, lastTurnGuessedCount: newGuessed.length, phase: 'turn-summary' };
      }
      return { ...state, scores: newScores, activeDeck: rest, deckForRound: newDeckForRound, turnGuessedCards: newGuessed };
    }
    case 'CARD_SKIPPED': {
      const [skipped, ...rest] = state.activeDeck;
      return { ...state, activeDeck: [...rest, skipped] };
    }
    case 'TURN_ENDED': {
      return { ...state, lastTurnGuessedCount: state.turnGuessedCards.length, phase: 'turn-summary' };
    }
    case 'NEXT_TURN_OR_ROUND': {
      if (state.deckForRound.length === 0) {
        if (state.currentRound === 3) return { ...state, phase: 'final' };
        return { ...state, phase: 'round-end' };
      }
      const nextTeam: 1 | 2 = state.currentTeam === 1 ? 2 : 1;
      return { ...state, phase: 'turn-start', currentTeam: nextTeam, activeDeck: shuffle([...state.deckForRound]), turnGuessedCards: [], lastTurnGuessedCount: 0 };
    }
    case 'START_NEXT_ROUND': {
      const nextRound = (state.currentRound + 1) as Round;
      const reshuffled = shuffle([...state.originalCards]);
      const startingTeam: 1 | 2 = state.scores.team1 <= state.scores.team2 ? 1 : 2;
      return { ...state, phase: 'round-intro', currentRound: nextRound, currentTeam: startingTeam, deckForRound: reshuffled, activeDeck: [], turnGuessedCards: [], lastTurnGuessedCount: 0 };
    }
    case 'RESET': {
      return { ...initialState, language: state.language };
    }
    default:
      return state;
  }
}

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<Action> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
