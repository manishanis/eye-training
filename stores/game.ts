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
  id: string;
  isCorrect: boolean;
  // Position on the grid
  gridRow: number;
  gridCol: number;
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
  totalRounds: number; // Add total rounds for the game
  warmupRoundsTotal: number;
  warmupRoundsCompleted: number;
  dotPositions: DotPosition[];
  // Feedback state
  feedbackOptionId: string | null;
  lastSelectionCorrect: boolean | null;
  isFeedbackActive: boolean;
  stateBeforePause: 'warmup' | 'playing' | null;
  // Option positioning state
  optionsGridRows: number;
  optionsGridCols: number;
  occupiedCells: Set<string>; // Stores "row-col" strings
  optionMoveTimerId: ReturnType<typeof setInterval> | null; // Timer ID for moving options
}

export const useGameStore = defineStore('game', {
  state: (): GameState => {
    // Access runtime config during state initialization
    const config = useRuntimeConfig();
    return {
      gameState: 'idle',
      currentTarget: '',
      currentOptions: [],
      score: 0,
      currentRound: 0,
      totalRounds: config.public.totalRounds as number, // Initialize from config
    warmupRoundsTotal: 3,
    warmupRoundsCompleted: 0,
    dotPositions: [],
    // Initialize feedback state
    feedbackOptionId: null,
    lastSelectionCorrect: null,
    isFeedbackActive: false,
    stateBeforePause: null,
    // Initialize positioning state
    optionsGridRows: 3, // Example grid size, adjust as needed
    optionsGridCols: 4, // Example grid size, adjust as needed (ensure rows*cols >= optionCount)
      occupiedCells: new Set<string>(),
      optionMoveTimerId: null,
    };
  },

  actions: {
    // Helper to reset feedback state
    resetFeedback() {
      this.isFeedbackActive = false;
      this.feedbackOptionId = null;
      this.lastSelectionCorrect = null;
    },

    // --- Option Movement Timer ---
    clearOptionMoveTimer() {
      if (this.optionMoveTimerId !== null) {
        clearInterval(this.optionMoveTimerId);
        this.optionMoveTimerId = null;
        console.log('Option move timer cleared.');
      }
    },

    startOptionMoveTimer() {
      // Clear any existing timer first
      this.clearOptionMoveTimer();

      // Access runtime config inside the action where it's needed
      const config = useRuntimeConfig();
      const intervalSeconds = config.public.optionMoveIntervalSeconds as number;

      if (intervalSeconds <= 0) {
          console.warn(`Invalid optionMoveIntervalSeconds: ${intervalSeconds}. Timer not started.`);
          return; // Don't start if interval is invalid
      }

      console.log(`Starting option move timer (${intervalSeconds}s interval)`);
      this.optionMoveTimerId = setInterval(() => {
        this.moveRandomOption();
      }, intervalSeconds * 1000); // Convert seconds to milliseconds
    },

    // --- Move Logic ---
    moveRandomOption() {
        // Ensure game is in a state where options should move
        if (this.currentOptions.length === 0 || this.gameState === 'paused' || this.gameState === 'gameOver' || this.gameState === 'idle') {
            // console.log('Skipping moveRandomOption (no options or game not active/paused/over).');
            return;
        }

        // Find available empty cells
        const emptyCells: { row: number; col: number }[] = [];
        for (let r = 0; r < this.optionsGridRows; r++) {
            for (let c = 0; c < this.optionsGridCols; c++) {
                if (!this.occupiedCells.has(`${r}-${c}`)) {
                    emptyCells.push({ row: r, col: c });
                }
            }
        }

        if (emptyCells.length === 0) {
            // console.log('No empty cells available to move option.');
            return; // Cannot move if no empty space
        }

        // Select a random option to move
        const optionIndexToMove = Math.floor(Math.random() * this.currentOptions.length);
        // Ensure the option exists at the index before accessing properties
        if (!this.currentOptions[optionIndexToMove]) {
            console.error(`Option not found at index ${optionIndexToMove}`);
            return;
        }
        const optionToMove = this.currentOptions[optionIndexToMove];


        // Select a random empty cell
        const targetCellIndex = Math.floor(Math.random() * emptyCells.length);
        const targetCell = emptyCells[targetCellIndex];

        console.log(`Moving option ${optionToMove.id} (${optionToMove.letters}) from ${optionToMove.gridRow}-${optionToMove.gridCol} to ${targetCell.row}-${targetCell.col}`);

        // Update occupied cells
        const oldPositionKey = `${optionToMove.gridRow}-${optionToMove.gridCol}`;
        const newPositionKey = `${targetCell.row}-${targetCell.col}`;
        this.occupiedCells.delete(oldPositionKey);
        this.occupiedCells.add(newPositionKey);

        // Update the option's position directly in the state array
        // Vue's reactivity should detect the change within the array element's properties.
        this.currentOptions[optionIndexToMove].gridRow = targetCell.row;
        this.currentOptions[optionIndexToMove].gridCol = targetCell.col;

        // Force reactivity update if direct property modification isn't detected (less common now)
        // this.currentOptions = [...this.currentOptions];
    },


    // --- Game Lifecycle Actions ---
    startWarmup() {                                                                                                               
      console.log('Starting warmup...');                                                                                          
      this.clearOptionMoveTimer(); // Ensure no old timer running                                                                 
      this.gameState = 'warmup';
      this.score = 0; // Score doesn't count in warmup
      this.currentRound = 0; // Reset round counter for warmup/start
      this.warmupRoundsCompleted = 0;
      this.generateNewRound();
      this.startOptionMoveTimer(); // Start timer when warmup starts
    },
    generateNewRound() {
      if (this.gameState === 'gameOver') return;

      // Reset feedback immediately when generating a new round
      this.resetFeedback();

      console.log('Generating new round...');
      const targetLength = 2;
      // Access runtime config within the action
      // Note: Accessing runtimeConfig directly might be tricky in store setup phase.
      // A common pattern is to pass config when initializing or calling actions,
      // but let's try accessing it directly here first. If it fails, we'll adjust.
      const config = useRuntimeConfig(); // Get runtime config
      const numberOfOptions = config.public.optionCount as number; // Use configured value

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

      // Shuffle the options to randomize their order
      shuffleArray(newOptions);

      // Assign grid positions after shuffling
      this.occupiedCells.clear();
      const assignedOptions: Option[] = [];
      let currentGridRow = 0;
      let currentGridCol = 0;

      for (const option of newOptions) {
          // Find the next available cell
          while (this.occupiedCells.has(`${currentGridRow}-${currentGridCol}`)) {
              currentGridCol++;
              if (currentGridCol >= this.optionsGridCols) {
                  currentGridCol = 0;
                  currentGridRow++;
                  // Basic check to prevent infinite loop if grid is too small
                  if (currentGridRow >= this.optionsGridRows) {
                      console.error("Options grid is too small for the number of options!");
                      // Handle error appropriately - maybe resize grid or throw error
                      break;
                  }
              }
          }

          if (currentGridRow < this.optionsGridRows) { // Check if a spot was found
              const positionKey = `${currentGridRow}-${currentGridCol}`;
              this.occupiedCells.add(positionKey);
              assignedOptions.push({
                  ...option,
                  gridRow: currentGridRow,
                  gridCol: currentGridCol,
              });
          } else {
             // Handle the case where no spot was found for an option
             console.error(`Could not assign position for option ${option.id}`);
          }
      }


      // Shuffle the options *after* assigning positions if needed,
      // though shuffling might not be necessary if initial placement is grid-based.
      // Let's keep the shuffle for now.
      shuffleArray(assignedOptions);

      // Update the store state
      this.currentOptions = assignedOptions;


      // Handle round counting and state transition
      if (this.gameState === 'warmup') {
        this.warmupRoundsCompleted++;
        // DO NOT increment this.currentRound during warmup
        console.log(`Warmup round ${this.warmupRoundsCompleted}/${this.warmupRoundsTotal} completed.`);
        // Check if warmup is finished
        if (this.warmupRoundsCompleted >= this.warmupRoundsTotal) {
          console.log('Warmup complete. Transitioning to playing state.');
          // Transition to actual game after warmup
          this.gameState = 'playing';
          this.currentRound = 0; // Reset round counter before the first playing round
          // Immediately generate the first playing round
          this.generateNewRound();
          return; // Exit early as we've called generateNewRound again
        }
      } else if (this.gameState === 'playing') {
        this.currentRound++; // Increment round ONLY for the main game
        console.log(`Playing round ${this.currentRound}/${this.totalRounds} generated.`);
      }
    },

    // Handles the user selecting an option
    selectOption(optionId: string) {
      // Ignore selection if feedback is currently active or game not playing/warmup
      if (this.isFeedbackActive || (this.gameState !== 'playing' && this.gameState !== 'warmup')) {
        return;
      }

      console.log(`Option selected: ${optionId}`);
      const selectedOption = this.currentOptions.find(opt => opt.id === optionId);

      if (!selectedOption) return; // Should not happen

      const isCorrect = selectedOption.isCorrect;

      // Set feedback state
      this.feedbackOptionId = optionId;
      this.lastSelectionCorrect = isCorrect;
      this.isFeedbackActive = true; // Show feedback styling

      if (isCorrect) {
        console.log('Correct selection!');
        // Only increment score if in the actual 'playing' state
        if (this.gameState === 'playing') {
          this.score += 10; // Example scoring
        }
        // Check if the game should end (only in 'playing' state)
        if (this.gameState === 'playing' && this.currentRound >= this.totalRounds) {
          console.log(`Game over: Reached round ${this.currentRound}/${this.totalRounds}`);
          this.stopGame(); // End the game
        } else {
          // Proceed to the next round after a delay
          setTimeout(() => {
            this.generateNewRound();
            // Feedback is reset by generateNewRound
          }, 500); // 500ms delay for feedback visibility
        }
      } else {
        console.log('Incorrect selection.');
        // Handle incorrect selection (e.g., just show feedback)
        // Reset feedback after a delay, but don't advance round
        setTimeout(() => {
          this.resetFeedback();
        }, 500); // 500ms delay for feedback visibility
      }
    },

    // Pauses the game
    pauseGame() {
      if (this.gameState === 'playing' || this.gameState === 'warmup') {
        this.stateBeforePause = this.gameState;
        this.gameState = 'paused';
        this.clearOptionMoveTimer(); // Stop timer when paused
        console.log('Game paused');
      }
    },
    resumeGame() {
      if (this.gameState !== 'paused') return;

      // Restore the game state from before pausing
      if (!this.stateBeforePause) {
        // Fallback if stateBeforePause wasn't set (shouldn't happen in normal flow)
        console.warn('State before pause was not set. Falling back based on warmup completion.');
        this.gameState = (this.warmupRoundsCompleted >= this.warmupRoundsTotal) ? 'playing' : 'warmup';
      } else {
        this.gameState = this.stateBeforePause; // Restore the correct state
      }
      this.stateBeforePause = null;
      console.log(`Game resumed to ${this.gameState}`);
      this.startOptionMoveTimer(); // Restart timer when resumed
    },

    // Action to stop the game and clean up timers
    stopGame() {
        console.log('Stopping game...');
        this.gameState = 'gameOver'; // Or 'idle'
        this.clearOptionMoveTimer();
        // Reset other relevant state if needed
        this.currentOptions = [];
        this.currentTarget = '';
    },

    // Placeholder for updating dot positions (can likely be removed if not used)
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
