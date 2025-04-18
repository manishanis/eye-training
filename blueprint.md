# Blueprint: Rapid Letter Recognition Game

## 1. Concept Overview

A web-based application designed for eye training and improving rapid letter/character recognition speed. The core gameplay involves presenting a target sequence (initially two letters) and requiring the user to quickly locate and click/tap the matching sequence among several distractors displayed below. Background elements (dots) will periodically move to add a dynamic challenge and train focus amidst visual noise.

**Built With:** Nuxt 3 (Vue 3)

## 2. Target Audience

* Individuals seeking to improve reading speed and visual processing.
* People looking to enhance visual attention and focus.
* Students or language learners practicing character/letter recognition.
* Individuals using it as a supplementary tool for specific vision therapy exercises (under guidance).
* Users looking for cognitive stimulation games.
* Gamers aiming to improve reaction time and visual acuity.

## 3. Core Features (Minimum Viable Product - MVP)

* **Game Screen:** Main interface displaying the target, options, score, and controls.
* **Target Display:** Shows the current two-letter sequence the user needs to find.
* **Options Display:**
    * Displays multiple two-letter sequences in circular elements.
    * One option matches the target.
    * Other options are randomly generated distractors.
    * Options are placed in a somewhat scattered/grid layout.
* **Random Generation:**
    * Generate random, distinct two-letter pairs for the target and distractors each round.
    * Ensure the target pair appears exactly once in the options.
* **Interaction:**
    * User clicks/taps on an option circle.
    * System checks if the selected option matches the target.
* **Feedback:**
    * Immediate visual feedback for correct selections (e.g., highlight green, brief animation).
    * Immediate visual feedback for incorrect selections (e.g., highlight red, brief shake).
* **Progression:**
    * Advance to the next round upon correct selection.
    * Generate a new target and options.
* **Scoring/Rounds:**
    * Display the current round number or score.
    * (Optional MVP): Implement the "Warm-Up Rounds" concept shown in the screenshot.
* **Dynamic Background:**
    * Subtle, randomly positioned dots in the background area where options are displayed.
    * These dots gently and periodically shift position.
* **Pause Functionality:** A button to pause and resume the game state (stops timers and animations).

## 4. Technology Stack

* **Framework:** Nuxt 3
* **Language:** TypeScript (recommended) / JavaScript
* **State Management:** Pinia (built-in and recommended for Nuxt 3)
* **Styling:** Tailwind CSS (recommended for utility-first styling) or standard CSS/SCSS.
* **Animation:** CSS Transitions/Animations or a library like GSAP (if complex animations are needed for dots).

## 5. Component Breakdown (Nuxt 3 `<script setup>` style)

* **`pages/index.vue` or `pages/play.vue`:** Main page component hosting the game.
* **`components/GameContainer.vue`:** Wrapper for the entire game interface, potentially managing game state transitions (start, playing, paused, game over).
* **`components/TargetDisplay.vue`:**
    * Props: `targetLetters: string`
    * Displays the target letters prominently.
* **`components/OptionsArea.vue`:**
    * Props: `options: Array<{ letters: string, id: number|string }>`
    * Manages the layout (e.g., CSS Grid or Flexbox) of `OptionItem` components.
    * May handle the background dot animation logic or contain `BackgroundDots.vue`.
* **`components/OptionItem.vue`:**
    * Props: `letters: string`, `id: number|string`
    * Emits: `@select(id)` when clicked/tapped.
    * Displays the letter pair inside a circle.
    * Handles hover/active states.
    * Can have props for feedback states (e.g., `isCorrect`, `isIncorrect`).
* **`components/ScoreBoard.vue`:**
    * Props: `score: number`, `round: number`, `warmupRoundsLeft: number` (optional)
    * Displays game statistics.
* **`components/PauseButton.vue`:**
    * Emits: `@togglePause`
    * Displays pause/play icon.
* **`components/FeedbackIndicator.vue`:** (Optional: Could be integrated into `OptionItem` or `GameContainer`)
    * Provides global visual feedback (e.g., screen flash).
* **`components/BackgroundDots.vue`:** (Could be part of `OptionsArea.vue`)
    * Manages the rendering and animation of the moving background dots.

## 6. State Management (Pinia Store - e.g., `stores/game.ts`)

* `gameState`: string (`idle`, `warmup`, `playing`, `paused`, `gameOver`)
* `currentTarget`: string
* `currentOptions`: Array<{ letters: string, id: number|string, isCorrect: boolean }>
* `score`: number
* `currentRound`: number
* `warmupRoundsTotal`: number
* `warmupRoundsCompleted`: number
* `dotPositions`: Array<{ x: number, y: number, id: number }> (if managing dot positions reactively)
* **Actions:**
    * `startGame()`
    * `startWarmup()`
    * `generateNewRound()`
    * `selectOption(optionId)`
    * `pauseGame()`
    * `resumeGame()`
    * `updateDotPositions()`
* **Getters:**
    * `isPaused`: boolean
    * `isGameOver`: boolean
    * `displayScore`: number
    * `displayRound`: number | string

## 7. Game Logic Flow

1.  **Initialize:** Set `gameState` to `idle` or `warmup`. Display start/warmup info.
2.  **Start Round:**
    * Call `generateNewRound()` action.
    * Generate target letters.
    * Generate distractor letters.
    * Combine target + distractors into `currentOptions` array, shuffle positions.
    * Update state: `currentTarget`, `currentOptions`, increment `currentRound` / decrement `warmupRoundsLeft`.
    * Set `gameState` to `playing`.
3.  **User Interaction:**
    * User clicks an `OptionItem`.
    * `OptionItem` emits `@select` with its ID.
    * `GameContainer` or `OptionsArea` calls the `selectOption(optionId)` Pinia action.
4.  **Check Selection:**
    * The `selectOption` action compares the selected option's letters with `currentTarget`.
    * Provide visual feedback (update component state briefly or use a dedicated feedback mechanism).
    * If correct: Increment `score`, trigger `generateNewRound()` after a short delay.
    * If incorrect: Apply penalty (optional, e.g., time penalty, brief lockout), potentially flash feedback.
5.  **Background Dots:**
    * An interval timer (`setInterval`) periodically calls `updateDotPositions()` action or triggers CSS animation changes.
    * Ensure timer is cleared/paused correctly based on `gameState`.
6.  **Pause/Resume:**
    * `PauseButton` click toggles `pauseGame()` / `resumeGame()` actions.
    * These actions update `gameState` and should pause/resume timers and animations.

## 8. Visual Design / UI Elements (Based on Screenshot)

* **Theme:** Dark background, light text/elements.
* **Color Palette:** Orange/Peach background for options area, white/light grey text, distinct color for the target element (e.g., yellow/orange outline).
* **Layout:** Centered target, grid/scattered layout for options below.
* **Elements:** Circular shapes for displaying letter pairs.
* **Typography:** Clear, sans-serif font.
* **Animation:** Smooth transitions for dot movement, subtle feedback animations on click.

## 9. Potential Enhancements (Post-MVP)

* **Difficulty Levels:**
    * Increase number of options.
    * Decrease time limit per round (add timer).
    * Increase speed/density of moving dots.
    * Use visually similar distractors (e.g., 'OQ' vs 'OO', 'VW' vs 'VV').
* **Game Modes:** Numbers, symbols, short words.
* **Timer:** Add a countdown timer per round for added pressure.
* **Sound Effects:** Sounds for correct/incorrect answers, round start, etc.
* **High Scores:** Local storage implementation for tracking personal bests.
* **Settings:** Allow user to customize number of options, speed, etc.
* **Accessibility:** Improve color contrast options, consider font size adjustments.
* **More Complex Animations:** Different patterns or behaviors for background elements.

## 10. Notes & Considerations

* **Responsiveness:** Ensure the layout works well on various screen sizes (mobile-first approach recommended).
* **Performance:** Optimize background dot animation to avoid performance issues, especially on mobile. Use CSS transforms (`translate`) where possible.
* **Letter Generation:** Decide on the pool of letters (uppercase English alphabet?). Ensure generated pairs are reasonably pronounceable/distinct if desired, or purely random. Avoid generating the same distractor multiple times in one round.
* **Touch vs. Mouse:** Ensure click/tap events work reliably on both desktop and touch devices.
* **Nuxt 3 Specifics:** Leverage auto-imports, composables (`useGameStore()`), and Nuxt's file-based routing and structure.
