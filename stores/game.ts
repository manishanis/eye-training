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

// --- Interfaces ---

// Define the structure for an option item
interface Option {
  letters: string;
  id: string;
  isCorrect: boolean;
  // Position on the grid
  gridRow: number;
  gridCol: number;
}

// Define the structure for the result of a single round
export interface RoundResult {
  round: number;
  target: string;
  selected: string;
  isCorrect: boolean;
  timeMs: number; // Time taken in milliseconds for the *correct* selection
}

// Define the structure for a single click record
interface ClickRecord {
  roundLabel: string; // e.g., "W1", "W2", "1", "2"
  clickedLetters: string;
  isCorrect: boolean; // Was this click the correct option?
  timeMs: number; // Time since round start for this specific click
}

// Define the structure for a dot position
interface DotPosition {
  x: number;
  y: number;
  id: number;
}

// Define the structure for game settings
interface GameSettings {
  totalRounds: number;
  optionsGridRows: number;
  optionsGridCols: number;
  optionCount: number; // Total number of options (1 correct + distractors)
  optionMoveIntervalSeconds: number; // Interval for moving options
  // Add other settings here later
}

// Define the structure for the game state
interface GameState {
  gameState: 'idle' | 'warmup' | 'playing' | 'paused' | 'gameOver';
  settings: GameSettings; // Add settings object
  currentTarget: string;
  currentOptions: Option[];
  score: number;
  currentRound: number;
  // totalRounds is now part of settings
  warmupRoundsTotal: number;
  warmupRoundsCompleted: number;
  dotPositions: DotPosition[];
  // Feedback state
  feedbackOptionId: string | null;
  lastSelectionCorrect: boolean | null;
  isFeedbackActive: boolean;
  stateBeforePause: 'warmup' | 'playing' | null;
  // Option positioning state - rows/cols moved to settings
  occupiedCells: Set<string>; // Stores "row-col" strings
  optionMoveTimerId: ReturnType<typeof setInterval> | null; // Timer ID for moving options
  // Timing and results state
  roundStartTime: number; // Timestamp when the current round started
  roundResults: RoundResult[]; // Array to store results of each *successful* round
  clickHistory: ClickRecord[]; // Array to store every click attempt
}

export const useGameStore = defineStore('game', {
  state: (): GameState => {
    // Access runtime config during state initialization
    const config = useRuntimeConfig();
    // Default settings
    // Note: Accessing runtimeConfig here can be unreliable. Use hardcoded defaults
    // or load from localStorage/API after store creation if needed.
    const defaultSettings: GameSettings = {
      totalRounds: 5,
      optionsGridRows: 4,
      optionsGridCols: 5,
      optionCount: 18,
      optionMoveIntervalSeconds: 0.8, // Default value, previously from nuxt.config
    };

    return {
      gameState: 'idle',
      settings: { ...defaultSettings }, // Initialize settings
      currentTarget: '',
      currentOptions: [],
      score: 0,
      currentRound: 0,
      // totalRounds removed, use settings.totalRounds
      warmupRoundsTotal: 3, // Keep warmup rounds for now, could move to settings later
      warmupRoundsCompleted: 0,
      dotPositions: [],
      // Initialize feedback state
      feedbackOptionId: null,
      lastSelectionCorrect: null,
      isFeedbackActive: false,
      stateBeforePause: null,
      // Initialize positioning state - rows/cols are in settings now
      occupiedCells: new Set<string>(),
      optionMoveTimerId: null,
      // Initialize timing and results
      roundStartTime: 0,
      roundResults: [], // Initialize the successful results array
      clickHistory: [], // Initialize the click history array
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

      // Get interval from settings
      const intervalSeconds = this.settings.optionMoveIntervalSeconds;

      if (intervalSeconds <= 0) {
        console.warn(`Invalid optionMoveIntervalSeconds in settings: ${intervalSeconds}. Timer not started.`);
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
      for (let r = 0; r < this.settings.optionsGridRows; r++) {
        for (let c = 0; c < this.settings.optionsGridCols; c++) {
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
      const config = useRuntimeConfig();
      const warmupEnabled = config.public.enableWarmup as boolean;

      console.log(`Starting game... Warmup enabled: ${warmupEnabled}`);
      this.clearOptionMoveTimer(); // Ensure no old timer running
      this.score = 0;
      this.currentRound = 0;
      this.warmupRoundsCompleted = 0;
      this.roundResults = []; // Clear previous results
      this.clickHistory = []; // Clear previous history

      if (warmupEnabled) {
        console.log('Starting warmup phase...');
        this.gameState = 'warmup';
        this.generateNewRound();
        this.startOptionMoveTimer(); // Start timer when warmup starts
      } else {
        console.log('Skipping warmup, starting playing phase directly...');
        this.gameState = 'playing';
        // currentRound is already 0, generateNewRound will increment it to 1
        this.generateNewRound();
        this.startOptionMoveTimer(); // Start timer when playing starts
      }
    },
    generateNewRound() {
      if (this.gameState === 'gameOver') return;

      // Reset feedback immediately when generating a new round
      this.resetFeedback();

      console.log('Generating new round...');
      const targetLength = 2;
      // Access runtime config within the action
      const numberOfOptions = this.settings.optionCount; // Use configured value from settings

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
          if (currentGridCol >= this.settings.optionsGridCols) {
            currentGridCol = 0;
            currentGridRow++;
            // Basic check to prevent infinite loop if grid is too small
            if (currentGridRow >= this.settings.optionsGridRows) {
              console.error("Options grid is too small for the number of options! Check settings.");
              // Handle error appropriately - maybe resize grid or throw error
              break;
            }
          }
        }

        if (currentGridRow < this.settings.optionsGridRows) { // Check if a spot was found
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

      // Record the start time for the new round if not game over
      if (this.gameState !== 'gameOver') {
        this.roundStartTime = performance.now();
        console.log(`Round start time recorded: ${this.roundStartTime}`);
      }


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
        console.log(`Playing round ${this.currentRound}/${this.settings.totalRounds} generated.`);
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

      // --- Record Every Click ---
      const timeTaken = performance.now() - this.roundStartTime;
      const isCorrectClick = selectedOption.isCorrect; // Determine correctness early

      // Determine the round label based on game state
      let currentRoundLabel: string;
      const config = useRuntimeConfig();
      const warmupEnabled = config.public.enableWarmup as boolean;

      if (warmupEnabled && this.gameState === 'warmup') {
        // Warmup rounds are 1-based in the label (W1, W2, ...)
        // warmupRoundsCompleted increments *after* the round starts, so add 1
        currentRoundLabel = `W${this.warmupRoundsCompleted + 1}`;
      } else {
        // Playing rounds use the currentRound number directly
        // Ensure currentRound is at least 1 if warmup is skipped
        const roundNum = this.currentRound > 0 ? this.currentRound : 1;
        currentRoundLabel = `${roundNum}`;
      }

      const clickData: ClickRecord = {
        roundLabel: currentRoundLabel, // Store the calculated label
        clickedLetters: selectedOption.letters,
        isCorrect: isCorrectClick, // Add the correctness flag
        timeMs: Math.round(timeTaken),
      };
      this.clickHistory.push(clickData);
      console.log('Click Recorded:', clickData); // Log every click
      // --- End Click Recording ---

      // Ignore further processing if feedback is active or game not in active state
      if (this.isFeedbackActive || (this.gameState !== 'playing' && this.gameState !== 'warmup')) {
        return;
      }

      // --- Process Correct/Incorrect Selection ---
      // We already determined correctness above for the click log
      const isCorrect = isCorrectClick;

      // Record the *successful* round result if in the 'playing' state and correct
      if (this.gameState === 'playing' && isCorrect) {
        const result: RoundResult = {
          round: this.currentRound,
          target: this.currentTarget,
          selected: selectedOption.letters,
          isCorrect: isCorrect,
          timeMs: Math.round(timeTaken), // Store as integer milliseconds
        };
        this.roundResults.push(result);
        console.log('Round result recorded:', result);
      }

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
        if (this.gameState === 'playing' && this.currentRound >= this.settings.totalRounds) {
          console.log(`Game over: Reached round ${this.currentRound}/${this.settings.totalRounds}`);
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
      if (this.stateBeforePause) {
        this.gameState = this.stateBeforePause; // Restore the correct state
      } else {
        // Fallback if stateBeforePause wasn't set (shouldn't happen in normal flow)
        console.warn('State before pause was not set. Falling back based on config and warmup completion.');
        const config = useRuntimeConfig();
        const warmupEnabled = config.public.enableWarmup as boolean;
        if (warmupEnabled) {
          this.gameState = (this.warmupRoundsCompleted >= this.warmupRoundsTotal) ? 'playing' : 'warmup';
        } else {
          this.gameState = 'playing'; // If warmup disabled, always resume to playing
        }
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
      // Reset feedback state as well
      this.resetFeedback();
    },

    // Action to restart the game
    restartGame() {
      console.log('Restarting game...');
      this.clearOptionMoveTimer(); // Ensure timer is stopped
      this.gameState = 'idle';
      this.score = 0;
      this.currentRound = 0;
      this.warmupRoundsCompleted = 0;
      this.currentTarget = '';
      this.currentOptions = [];
      this.occupiedCells.clear();
      this.resetFeedback(); // Reset feedback state
      this.stateBeforePause = null;
      // Reset results and history
      this.roundResults = [];
      this.clickHistory = [];
      // No need to call generateNewRound or startWarmup here,
      // the user will click "Start Game" again from the idle state.
    },

    // Action to update game settings
    updateSettings(newSettings: Partial<GameSettings>) {
      console.log('Updating settings:', newSettings);
      this.settings = { ...this.settings, ...newSettings };
      // Persist settings to localStorage or backend if needed here
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
    // Getter for successful round results
    getRoundResults: (state): RoundResult[] => state.roundResults,
    // Getter for all click history
    getClickHistory: (state): ClickRecord[] => state.clickHistory,
    // Getter for settings
    getSettings: (state): GameSettings => state.settings,
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['settings']
  },
});
