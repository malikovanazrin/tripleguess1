export type Round = 1 | 2 | 3;

export const ROUND_INFO: Record<
  Round,
  { name: string; rule: string; description: string; icon: string }
> = {
  1: {
    name: 'Describe It',
    rule: 'Say anything except the card name',
    description:
      'Use words, sentences, or phrases to describe the card — but never say the actual name!',
    icon: '💬',
  },
  2: {
    name: 'One Word',
    rule: 'One word only as your clue',
    description:
      'You can only say a single word as your clue. Choose wisely — your team should remember these cards!',
    icon: '1️⃣',
  },
  3: {
    name: 'Charades',
    rule: 'No words — act it out!',
    description:
      'Silence! No words. Use gestures, body language, and sound effects (within reason), but no talking.',
    icon: '🤸',
  },
};

export interface GameState {
  cards: string[];
  cardCount: number;
  currentRound: Round;
  currentTeam: 1 | 2;
  scores: { team1: number; team2: number };
  deckForRound: string[];
  turnGuessedCount: number;
}

export const TURN_DURATION = 60;
