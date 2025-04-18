**Overall Goal:** Implement the MVP features described in the blueprint.

**Phase 1: Project Setup & Core Component Structure**

1.  **Verify Dependencies:** Ensure `pinia` is installed (`@pinia/nuxt` should be in `devDependencies` and listed in `modules` within `nuxt.config.ts`). Ensure Tailwind CSS is set up correctly (check `nuxt.config.ts` for `@nuxtjs/tailwindcss` and the presence of `tailwind.config.js`). If not, install/configure them first.
2.  **Create Store:** Create the Pinia store file: `stores/game.ts`. Define the basic state properties outlined in the blueprint (e.g., `gameState`, `currentTarget`, `currentOptions`, `score`, `currentRound`). Add placeholder initial values.
3.  **Create Component Files:** Create the following empty component files as specified in the blueprint:
    *   `components/GameContainer.vue`
    *   `components/TargetDisplay.vue`
    *   `components/OptionsArea.vue`
    *   `components/OptionItem.vue`
    *   `components/ScoreBoard.vue`
    *   `components/PauseButton.vue`
    *   `(Optional)` `components/BackgroundDots.vue` (or decide to integrate into `OptionsArea.vue` later)
4.  **Basic App Structure (`app.vue` or `pages/index.vue`):** Modify the main entry point (`app.vue` or create `pages/index.vue` if using Nuxt pages) to import and render the `GameContainer.vue` component.
5.  **Basic Layout (`GameContainer.vue`):** Inside `GameContainer.vue`, import and arrange the other core components (`TargetDisplay`, `OptionsArea`, `ScoreBoard`, `PauseButton`) using basic HTML structure and Tailwind CSS classes to approximate the layout shown/described (target top, options middle, score/controls somewhere). Use placeholder content for now.

**Phase 2: Static Display & Styling**

1.  **Style Components:** Implement the basic visual styling for each component according to the "Visual Design / UI Elements" section of the blueprint using Tailwind CSS:
    *   `TargetDisplay`: Style to make the target letters prominent.
    *   `OptionItem`: Style as a circle containing letters.
    *   `OptionsArea`: Style the background (e.g., orange/peach). Set up a layout (Grid or Flexbox) to hold `OptionItem`s.
    *   `ScoreBoard`: Style to display text labels and values clearly.
    *   `PauseButton`: Style as a button.
    *   Apply the dark theme background to the main container/page.
2.  **Props for Display:** Define props in components to receive static data:
    *   `TargetDisplay`: `targetLetters: string`
    *   `OptionItem`: `letters: string`
    *   `OptionsArea`: `options: Array<{ letters: string, id: string }>` (or similar structure)
    *   `ScoreBoard`: `score: number`, `round: number`
3.  **Pass Placeholder Data:** In `GameContainer.vue` (or wherever components are composed), pass static, hardcoded placeholder data to the child components via their props to verify the visual layout (e.g., `targetLetters="AB"`, a sample array of options).

**Phase 3: State Management & Game Logic Core**

1.  **Implement Store Actions (Core):** In `stores/game.ts`:
    *   Create a helper function `generateRandomLetters(length: number)` (e.g., uppercase English alphabet).
    *   Implement the `generateNewRound` action:
        *   Generate the `currentTarget` string (e.g., 2 letters).
        *   Generate several distractor strings (ensure they are different from the target and each other).
        *   Create the `currentOptions` array, including one object with the `currentTarget` and `isCorrect: true`, and others for distractors with `isCorrect: false`. Assign unique IDs.
        *   Shuffle the `currentOptions` array randomly.
        *   Update the store state (`currentTarget`, `currentOptions`, increment `currentRound`).
    *   Implement `startGame` or `startWarmup` action: Set initial `gameState`, reset score/round, and call `generateNewRound` to set up the first round.
2.  **Connect Store to Components:**
    *   In `GameContainer.vue` (or relevant components), import and use the game store (`import { useGameStore } from '@/stores/game'; const gameStore = useGameStore();`).
    *   Use store state (`gameStore.currentTarget`, `gameStore.currentOptions`, etc.) instead of placeholder data to pass as props to child components (`TargetDisplay`, `OptionsArea`, `ScoreBoard`). Make relevant parts reactive using `computed` if necessary.
    *   Call the `startGame` (or `startWarmup`) action when the game component mounts (`onMounted`).

**Phase 4: Interaction & Feedback**

1.  **Option Selection:**
    *   In `OptionItem.vue`: Add a `@click` handler. When clicked, emit an event (`@select`) with the option's unique `id`. Define `id` as a prop.
    *   In `OptionsArea.vue`: Listen for the `@select` event from `OptionItem` components. When received, call a method that invokes the `selectOption` action in the Pinia store, passing the selected `id`.
2.  **Implement Store Action (`selectOption`):** In `stores/game.ts`:
    *   Implement the `selectOption(optionId)` action.
    *   Find the selected option in `currentOptions` using the `optionId`.
    *   Check if `selectedOption.isCorrect` is true.
    *   **If Correct:** Increment score, potentially set a temporary state for positive feedback, and trigger `generateNewRound` (perhaps after a short delay using `setTimeout`).
    *   **If Incorrect:** Potentially set a temporary state for negative feedback.
3.  **Visual Feedback:**
    *   Modify `OptionItem.vue` to visually change based on selection feedback. This could involve:
        *   Adding props like `isCorrect: boolean | null` and `isIncorrect: boolean | null`.
        *   The parent component (`OptionsArea` or `GameContainer`) briefly sets these props on the relevant `OptionItem` after a selection is processed by the store.
        *   Use conditional Tailwind classes within `OptionItem.vue` based on these props (e.g., `bg-green-500` for correct, `bg-red-500` for incorrect). Reset the feedback state after a short duration.

**Phase 5: Dynamic Background & Pause**

1.  **Background Dots:**
    *   Implement the `BackgroundDots.vue` component (or integrate logic into `OptionsArea.vue`).
    *   Render dots (e.g., absolutely positioned `div` elements) based on data (e.g., an array of `{x, y, id}` objects). Store this data potentially in the Pinia store (`dotPositions`) or component state.
    *   Implement movement:
        *   **Option A (CSS):** Use CSS transitions/animations triggered periodically or on state change. Simpler for basic movement.
        *   **Option B (JS):** Use `setInterval` within the component (or triggered by a store action like `updateDotPositions`) to update the `x, y` coordinates of the dots. Ensure the interval is managed correctly (cleared on unmount, paused). Use CSS transforms (`translate`) for performance.
2.  **Pause Functionality:**
    *   In `PauseButton.vue`: Add a `@click` handler that emits a `@togglePause` event. Display different icons based on the paused state.
    *   In `GameContainer.vue`: Listen for `@togglePause`. Call corresponding actions in the store.
    *   Implement `pauseGame` and `resumeGame` actions in `stores/game.ts`: Update `gameState` to `paused` or `playing`.
    *   Modify the background dot animation logic (JS `setInterval` or CSS animation state) to pause/resume based on `gameStore.gameState === 'paused'`.
    *   Prevent option selection clicks when the game is paused (e.g., add conditional styling/event handling in `OptionItem` or `OptionsArea`).

**Phase 6: Refinement**

1.  **Responsiveness:** Test the layout on various screen sizes and apply responsive Tailwind classes (`sm:`, `md:`, etc.) as needed to ensure usability.
2.  **Final Styling:** Polish all visual elements, transitions, and animations.
3.  **Testing:** Thoroughly test all game logic, interactions, edge cases, and pause/resume functionality.
4.  **Code Cleanup:** Remove console logs, add comments where necessary, ensure consistent formatting.

This plan breaks down the implementation according to the blueprint. Follow these phases sequentially. Ask if you need clarification on any specific step.
