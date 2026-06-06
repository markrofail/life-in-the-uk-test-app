# Endless Mode — Design Spec

**Date:** 2026-06-06
**Status:** Approved

## Overview

Add an "Endless Mode" to the Life in the UK app. The user works through the entire question bank (~1198 questions) in a single session. After submitting each answer, the correct answer and explanation are revealed immediately. Stats (correct/incorrect question IDs) are updated in real time after each question. No result screen — on completion or quit, the user returns to the home dashboard.

## Scope

This feature adds new files and makes targeted modifications to existing ones. The existing exam flow (`exam.tsx`, `useExamSession`, `result.tsx`) is untouched.

---

## Architecture

### New files

| File | Purpose |
|------|---------|
| `app/endless.tsx` | Endless mode screen |
| `hooks/useEndlessSession.ts` | Session reducer for endless mode |

### Modified files

| File | Change |
|------|--------|
| `stores/useExamStore.ts` | Add `recordQuestionResult(id, isCorrect)` action |
| `components/QuestionCard.tsx` | Add optional `revealed` and `explanation` props |
| `app/index.tsx` | Add "Endless Mode" button |

---

## Session Logic (`useEndlessSession`)

### State shape

```ts
interface EndlessSessionState {
  questions: Question[];
  currentIndex: number;
  selectedOptions: string[];
  isRevealed: boolean;
  isFinished: boolean;
}
```

### Initialization

Questions are loaded by calling `getRandomExamQuestions(getTotalQuestionCount(), { incorrectIds, correctIds })`, passing the full bank size so all questions are included. This preserves the existing priority ordering: previously incorrect → unseen → mastered.

### Reducer actions

**`INITIALIZE`** — loads the full question set, resets all state.

**`SUBMIT`** — transitions from answering to revealed state:
- Sets `isRevealed = true`
- Evaluates correctness (same logic as `useExamSession`)
- No state mutation for stats — the screen calls `recordQuestionResult` after dispatching

**`NEXT`** — advances to the next question:
- Clears `selectedOptions`
- Sets `isRevealed = false`
- Increments `currentIndex`, or sets `isFinished = true` on the last question

### Button states

| Condition | Button label | Enabled |
|-----------|-------------|---------|
| No option selected, not revealed | Submit | No |
| Option selected, not revealed | Submit | Yes |
| Revealed, not last question | Next Question | Yes |
| Revealed, last question | Finish | Yes |

---

## `QuestionCard` Extension

Two new optional props:

```ts
revealed?: boolean       // default false — enables result-display mode
explanation?: string     // shown below options when revealed
```

**When `revealed = true`:**
- Correct answer options: green border + background
- Options that were selected but wrong: red border + background
- All other options: default styling (unchanged)
- Existing selection highlight is replaced by the result colours
- Options are non-tappable (touches ignored)
- Explanation text rendered below the options in muted style

**When `revealed = false` (default):** behaviour is identical to today. Exam mode passes no `revealed` prop and is unaffected.

---

## Store Change (`useExamStore`)

Add a single new action:

```ts
recordQuestionResult: (id: string, isCorrect: boolean) => void
```

Behaviour mirrors the per-question logic already inside `recordExamResult`:
- If correct: add to `correctQuestionIds`, remove from `incorrectQuestionIds`
- If incorrect: add to `incorrectQuestionIds` (if not already there)

The `lastExamResult` field is not updated by this action — it remains exam-mode-only.

---

## Screen (`app/endless.tsx`)

### Header
- Title: `Question X of 1198` (updates each question)
- Left: close (×) button — shows "Are you sure? Stats already saved." alert, then `router.replace('/')` on confirm

### Body
- `ScrollView` containing `QuestionCard`, passing `revealed` and `explanation` when in revealed state

### Bottom bar
- Single action button whose label and enabled state follow the table above
- On "Submit": dispatch `SUBMIT`, call `recordQuestionResult`
- On "Next Question": dispatch `NEXT`
- On "Finish": `router.replace('/')`

---

## Home Screen Change (`app/index.tsx`)

Add an "Endless Mode" button below "Take Practice Exam", linking to `/endless`.

---

## What is explicitly out of scope

- No mid-session resume (each session starts fresh)
- No end-of-session summary screen (home dashboard reflects real-time stats)
- No changes to exam mode, result screen, or review screen
