import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

// --- Helper Functions ---

/**
 * Generates a random string of uppercase letters.
 * @param length The desired length of the string.
 * @returns A random string of letters.
 */
function generateRandomLetters(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}


// --- Store Definition ---

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
      this.gameState = 'playing';
      this.score = 0;
      this.currentRound = 0; // Reset round counter for the actual game
      this.generateNewRound();
    },

    // Placeholder for startWarmup action
    startWarmup() {
      console.log('Starting warmup...');
      this.gameState = 'warmup';
      this.score = 0; // Score doesn't count in warmup
      this.currentRound = 0; // Use round counter for warmup rounds
      this.warmupRoundsCompleted = 0;
      this.generateNewRound();
    },

    // Generates a new target and options for the next round
    generateNewRound() {
      if (this.gameState === 'gameOver') return; // Don't generate if game over

      console.log('Generating new round...');
      const targetLength = 2; // As per blueprint
      const numberOfOptions = 5; // Example: 1 correct + 4 distractors

      // Generate the target letters
      this.currentTarget = generateRandomLetters(targetLength);

      // Generate distractors, ensuring they are unique and different from the target
      const distractors = new Set<string>();
      while (distractors.size < numberOfOptions - 1) {
        const potentialDistractor = generateRandomLetters(targetLength);
        if (potentialDistractor !== this.currentTarget) {
          distractors.add(potentialDistractor);
        }
      }

      // Create the options array
      const newOptions: Option[] = [];

      // Add the correct option
      newOptions.push({
        letters: this.currentTarget,
        id: uuidv4(), // Generate unique ID
        isCorrect: true,
      });

      // Add distractor options
      distractors.forEach(distractorLetters => {
        newOptions.push({
          letters: distractorLetters,
          id: uuidv4(), // Generate unique ID
          isCorrect: false,
        });
      });

      // Shuffle the options
      shuffleArray(newOptions);

      // Update the store state
      this.currentOptions = newOptions;

      // Handle round counting based on game state
      if (this.gameState === 'warmup') {
        this.warmupRoundsCompleted++;
        this.currentRound++; // Increment round display during warmup
        // Check if warmup is finished
        if (this.warmupRoundsCompleted >= this.warmupRoundsTotal) {
          // Transition to actual game after warmup
          // Maybe add a small delay or message here?
          this.startGame(); // Start the actual game
          return; // Exit early as startGame will call generateNewRound again
        }
      } else if (this.gameState === 'playing') {
        this.currentRound++; // Increment round for the main game
      }
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
