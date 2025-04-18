import { defineStore } from 'pinia';

// Define the structure for an option item
interface Option {
  letters: string;
  id: string; // Use string for ID to accommodate potential future needs
  isCorrect: boolean;
}

// Define the structure for a dot position
interface DotPosition {
  x: number;
  y: number;
  id: number;
}

// Define the structure for the game state
interface GameState {
  gameState: 'idle' | 'warmup' | 'playing' | 'paused' | 'gameOver';
  currentTarget: string;
  currentOptions: Option[];
  score: number;
  currentRound: number;
  warmupRoundsTotal: number; // Example value, adjust as needed
  warmupRoundsCompleted: number;
  dotPositions: DotPosition[]; // Placeholder for background dots
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    gameState: 'idle',
    currentTarget: '',
    currentOptions: [],
    score: 0,
    currentRound: 0,
    warmupRoundsTotal: 3, // Example initial value
    warmupRoundsCompleted: 0,
    dotPositions: [], // Initialize as empty
  }),

  actions: {
    // Placeholder for startGame action
    startGame() {
      console.log('Starting game...');
      // TODO: Implement game start logic (Phase 3)
      this.gameState = 'playing'; // Temporary transition
      this.score = 0;
      this.currentRound = 0;
      // this.generateNewRound(); // Will be called here later
    },

    // Placeholder for startWarmup action
    startWarmup() {
      console.log('Starting warmup...');
      // TODO: Implement warmup logic (Phase 3)
      this.gameState = 'warmup'; // Temporary transition
      this.score = 0;
      this.currentRound = 0;
      this.warmupRoundsCompleted = 0;
      // this.generateNewRound(); // Will be called here later
    },

    // Placeholder for generateNewRound action
    generateNewRound() {
      console.log('Generating new round...');
      // TODO: Implement round generation logic (Phase 3)
      this.currentRound++;
    },

    // Placeholder for selectOption action
    selectOption(optionId: string) {
      console.log(`Option selected: ${optionId}`);
      // TODO: Implement option selection logic (Phase 4)
      const selected = this.currentOptions.find(opt => opt.id === optionId);
      if (selected?.isCorrect) {
        this.score += 10; // Example scoring
        // this.generateNewRound(); // Trigger next round
      } else {
        // Handle incorrect selection
      }
    },

    // Placeholder for pauseGame action
    pauseGame() {
      if (this.gameState === 'playing' || this.gameState === 'warmup') {
        this.gameState = 'paused';
        console.log('Game paused');
        // TODO: Pause timers/animations (Phase 5)
      }
    },

    // Placeholder for resumeGame action
    resumeGame() {
      if (this.gameState === 'paused') {
        // Determine whether to return to 'playing' or 'warmup'
        // This might need refinement based on exact game flow
        this.gameState = 'playing'; // Or 'warmup' if paused during warmup
        console.log('Game resumed');
        // TODO: Resume timers/animations (Phase 5)
      }
    },

    // Placeholder for updating dot positions
    updateDotPositions() {
      console.log('Updating dot positions...');
      // TODO: Implement dot position logic (Phase 5)
    },
  },

  getters: {
    isPaused: (state): boolean => state.gameState === 'paused',
    isGameOver: (state): boolean => state.gameState === 'gameOver',
    // Example getter: Calculate remaining warmup rounds
    warmupRoundsLeft: (state): number => state.warmupRoundsTotal - state.warmupRoundsCompleted,
    // Simple display getters
    displayScore: (state): number => state.score,
    displayRound: (state): number => state.currentRound,
  },
});
