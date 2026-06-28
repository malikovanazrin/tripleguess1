import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Round } from '@/constants/game';
import { pickCards, shuffle } from '@/constants/cards';

export interface GameState {
  phase:
    | 'setup'
    | 'round-intro'
    | 'turn-start'
    | 'active-turn'
    | 'turn-summary'
    | 'round-end'
    | 'final';
  cardCount: number;
  currentRound: Round;
  currentTeam: 1 | 2;
  scores: { team1: number; team2: number };
  originalCards: string[];
  deckForRound: string[];
  activeDeck: string[];
  turnGuessedCards: string[];
  lastTurnGuessedCount: number;
}

type Action =
  | { type: 'START_GAME'; cardCount: number }
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
  cardCount: 30,
  currentRound: 1,
  currentTeam: 1,
  scores: { team1: 0, team2: 0 },
  originalCards: [],
  deckForRound: [],
  activeDeck: [],
  turnGuessedCards: [],
  lastTurnGuessedCount: 0,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const cards = pickCards(action.cardCount);
      return {
        ...initialState,
        phase: 'round-intro',
        cardCount: action.cardCount,
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
      const newDeckForRound = state.deckForRound.filter((c) => c !== guessed);

      if (rest.length === 0) {
        return {
          ...state,
          scores: newScores,
          activeDeck: [],
          deckForRound: newDeckForRound,
          turnGuessedCards: newGuessed,
          lastTurnGuessedCount: newGuessed.length,
          phase: 'turn-summary',
        };
      }
      return {
        ...state,
        scores: newScores,
        activeDeck: rest,
        deckForRound: newDeckForRound,
        turnGuessedCards: newGuessed,
      };
    }
    case 'CARD_SKIPPED': {
      const [skipped, ...rest] = state.activeDeck;
      return {
        ...state,
        activeDeck: [...rest, skipped],
      };
    }
    case 'TURN_ENDED': {
      return {
        ...state,
        lastTurnGuessedCount: state.turnGuessedCards.length,
        phase: 'turn-summary',
      };
    }
    case 'NEXT_TURN_OR_ROUND': {
      if (state.deckForRound.length === 0) {
        if (state.currentRound === 3) {
          return { ...state, phase: 'final' };
        }
        return { ...state, phase: 'round-end' };
      }
      const nextTeam: 1 | 2 = state.currentTeam === 1 ? 2 : 1;
      return {
        ...state,
        phase: 'turn-start',
        currentTeam: nextTeam,
        activeDeck: shuffle([...state.deckForRound]),
        turnGuessedCards: [],
        lastTurnGuessedCount: 0,
      };
    }
    case 'START_NEXT_ROUND': {
      const nextRound = (state.currentRound + 1) as Round;
      const reshuffled = shuffle([...state.originalCards]);
      return {
        ...state,
        phase: 'round-intro',
        currentRound: nextRound,
        currentTeam: state.scores.team1 <= state.scores.team2 ? 1 : 2,
        deckForRound: reshuffled,
        activeDeck: [],
        turnGuessedCards: [],
        lastTurnGuessedCount: 0,
      };
    }
    case 'RESET': {
      return { ...initialState };
    }
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
