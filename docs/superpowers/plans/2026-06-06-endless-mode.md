# Endless Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Endless Mode that walks the user through all ~1198 questions one at a time, revealing the correct answer and explanation after each submission, with per-question real-time stat updates.

**Architecture:** New dedicated route `/endless` with its own `useEndlessSession` hook (independent of the existing exam flow). `QuestionCard` gains optional `revealed`/`explanation` props for result-display mode. The store gains a `recordQuestionResult` action for single-question real-time stat commits.

**Tech Stack:** React Native (Expo Router), Zustand (persisted), TypeScript. No test runner is configured in this project — verification steps use manual app testing via `expo start`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `stores/useExamStore.ts` | Add `recordQuestionResult` action |
| Modify | `components/QuestionCard.tsx` | Add `revealed` + `explanation` props |
| Create | `hooks/useEndlessSession.ts` | Session reducer for endless mode |
| Create | `app/endless.tsx` | Endless mode screen |
| Modify | `app/_layout.tsx` | Register `endless` screen in the Stack |
| Modify | `app/index.tsx` | Add "Endless Mode" entry button |

---

## Task 1: Add `recordQuestionResult` to the store

**Files:**
- Modify: `stores/useExamStore.ts`

- [ ] **Step 1: Add the action signature to the interface**

In `stores/useExamStore.ts`, add one line to `ExamStoreState` after the existing `resetStats` line:

```typescript
// existing
resetStats: () => void;
// add after:
recordQuestionResult: (id: string, isCorrect: boolean) => void;
```

- [ ] **Step 2: Implement the action**

Inside the `create` call, add the implementation after `resetStats`:

```typescript
recordQuestionResult: (id, isCorrect) => set((state) => {
    const newIncorrectSet = new Set(state.incorrectQuestionIds);
    const newCorrectSet = new Set(state.correctQuestionIds);

    if (isCorrect) {
        newCorrectSet.add(id);
        newIncorrectSet.delete(id);
    } else {
        newIncorrectSet.add(id);
    }

    return {
        incorrectQuestionIds: Array.from(newIncorrectSet),
        correctQuestionIds: Array.from(newCorrectSet),
    };
}),
```

- [ ] **Step 3: Commit**

```bash
git add stores/useExamStore.ts
git commit -m "feat: add recordQuestionResult action to exam store"
```

---

## Task 2: Extend `QuestionCard` with revealed state

**Files:**
- Modify: `components/QuestionCard.tsx`

- [ ] **Step 1: Add the new props to the interface**

Replace the existing `Props` interface:

```typescript
interface Props {
    question: Question;
    selectedOptions: string[];
    onOptionToggle: (optionId: string, isMultipleChoice: boolean) => void;
    revealed?: boolean;
    explanation?: string;
}
```

- [ ] **Step 2: Accept the new props in the component signature**

```typescript
export const QuestionCard = memo(function QuestionCard({
    question,
    selectedOptions,
    onOptionToggle,
    revealed = false,
    explanation,
}: Props) {
```

- [ ] **Step 3: Replace `getOptionStyle` with a version that handles revealed state**

```typescript
const getOptionStyle = (optionId: string) => {
    if (revealed) {
        const isCorrect = question.correctAnswers.includes(optionId);
        const isSelected = selectedOptions.includes(optionId);
        if (isCorrect) return styles.optionCorrect;
        if (isSelected) return styles.optionWrong;
        return styles.optionDefault;
    }
    return selectedOptions.includes(optionId) ? styles.optionSelected : styles.optionDefault;
};
```

- [ ] **Step 4: Add a helper for option text style in revealed mode**

Add below `getOptionStyle`:

```typescript
const getOptionTextStyle = (optionId: string) => {
    if (!revealed) {
        return selectedOptions.includes(optionId) ? styles.optionTextSelected : null;
    }
    const isCorrect = question.correctAnswers.includes(optionId);
    const isSelected = selectedOptions.includes(optionId);
    if (isCorrect) return styles.optionTextCorrect;
    if (isSelected) return styles.optionTextWrong;
    return null;
};
```

- [ ] **Step 5: Disable touches and apply text styles in the render**

Replace the `TouchableOpacity` inside the options map:

```tsx
<TouchableOpacity
    key={option.id}
    style={[styles.optionButton, getOptionStyle(option.id)]}
    onPress={() => onOptionToggle(option.id, isMultipleChoice)}
    activeOpacity={0.7}
    disabled={revealed}
>
    <Text style={[styles.optionText, getOptionTextStyle(option.id)]}>
        {option.text}
    </Text>
</TouchableOpacity>
```

- [ ] **Step 6: Render explanation below the options**

After the closing `</View>` of `optionsContainer`, add:

```tsx
{revealed && explanation && (
    <View style={styles.explanationContainer}>
        <Text style={styles.explanationLabel}>Explanation</Text>
        <Text style={styles.explanationText}>{explanation}</Text>
    </View>
)}
```

- [ ] **Step 7: Add the new styles**

In the `StyleSheet.create` block, add after `optionTextSelected`:

```typescript
optionCorrect: {
    backgroundColor: 'rgba(104, 211, 145, 0.15)',
    borderColor: '#68D391',
},
optionWrong: {
    backgroundColor: 'rgba(252, 129, 129, 0.15)',
    borderColor: '#FC8181',
},
optionTextCorrect: {
    color: '#68D391',
    fontWeight: '600',
},
optionTextWrong: {
    color: '#FC8181',
    fontWeight: '600',
},
explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3182CE',
},
explanationLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#63B3ED',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
},
explanationText: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 22,
},
```

- [ ] **Step 8: Verify QuestionCard still works in exam mode**

Run `npx expo start` and take a practice exam. Confirm nothing visually changed — options still highlight on selection, no explanation appears, advancing works normally.

- [ ] **Step 9: Commit**

```bash
git add components/QuestionCard.tsx
git commit -m "feat: add revealed/explanation props to QuestionCard"
```

---

## Task 3: Create `useEndlessSession` hook

**Files:**
- Create: `hooks/useEndlessSession.ts`

- [ ] **Step 1: Create the file with state shape and action types**

```typescript
import { Question } from '@/types';
import { useCallback, useReducer } from 'react';

interface EndlessSessionState {
    questions: Question[];
    currentIndex: number;
    selectedOptions: string[];
    isRevealed: boolean;
    isFinished: boolean;
}

type EndlessSessionAction =
    | { type: 'INITIALIZE'; payload: Question[] }
    | { type: 'TOGGLE_OPTION'; payload: { optionId: string; isMultipleChoice: boolean } }
    | { type: 'SUBMIT' }
    | { type: 'NEXT' };
```

- [ ] **Step 2: Write the reducer**

```typescript
function endlessSessionReducer(
    state: EndlessSessionState,
    action: EndlessSessionAction
): EndlessSessionState {
    switch (action.type) {
        case 'INITIALIZE':
            return {
                questions: action.payload,
                currentIndex: 0,
                selectedOptions: [],
                isRevealed: false,
                isFinished: false,
            };

        case 'TOGGLE_OPTION': {
            if (state.isRevealed) return state;
            const { optionId, isMultipleChoice } = action.payload;
            if (isMultipleChoice) {
                if (state.selectedOptions.includes(optionId)) {
                    return {
                        ...state,
                        selectedOptions: state.selectedOptions.filter(id => id !== optionId),
                    };
                }
                return { ...state, selectedOptions: [...state.selectedOptions, optionId] };
            }
            return { ...state, selectedOptions: [optionId] };
        }

        case 'SUBMIT': {
            if (state.selectedOptions.length === 0 || state.isRevealed) return state;
            return { ...state, isRevealed: true };
        }

        case 'NEXT': {
            if (!state.isRevealed) return state;
            const isLastQuestion = state.currentIndex >= state.questions.length - 1;
            if (isLastQuestion) {
                return { ...state, isFinished: true };
            }
            return {
                ...state,
                currentIndex: state.currentIndex + 1,
                selectedOptions: [],
                isRevealed: false,
            };
        }

        default:
            return state;
    }
}
```

- [ ] **Step 3: Write the initial state and exported hook**

```typescript
const initialState: EndlessSessionState = {
    questions: [],
    currentIndex: 0,
    selectedOptions: [],
    isRevealed: false,
    isFinished: false,
};

export function useEndlessSession() {
    const [state, dispatch] = useReducer(endlessSessionReducer, initialState);

    const initializeSession = useCallback((questions: Question[]) => {
        dispatch({ type: 'INITIALIZE', payload: questions });
    }, []);

    const toggleOption = useCallback((optionId: string, isMultipleChoice: boolean) => {
        dispatch({ type: 'TOGGLE_OPTION', payload: { optionId, isMultipleChoice } });
    }, []);

    const submitAnswer = useCallback(() => {
        dispatch({ type: 'SUBMIT' });
    }, []);

    const nextQuestion = useCallback(() => {
        dispatch({ type: 'NEXT' });
    }, []);

    const currentQuestion =
        state.questions.length > 0 ? state.questions[state.currentIndex] : null;

    return {
        state,
        currentQuestion,
        initializeSession,
        toggleOption,
        submitAnswer,
        nextQuestion,
    };
}
```

- [ ] **Step 4: Commit**

```bash
git add hooks/useEndlessSession.ts
git commit -m "feat: add useEndlessSession hook"
```

---

## Task 4: Create `app/endless.tsx`

**Files:**
- Create: `app/endless.tsx`

- [ ] **Step 1: Write the screen**

```typescript
import { QuestionCard } from '@/components/QuestionCard';
import { Colors } from '@/constants/theme';
import { useEndlessSession } from '@/hooks/useEndlessSession';
import { useExamStore } from '@/stores/useExamStore';
import { getRandomExamQuestions, getTotalQuestionCount } from '@/utils/examUtils';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EndlessScreen() {
    const router = useRouter();
    const recordQuestionResult = useExamStore((state) => state.recordQuestionResult);
    const incorrectQuestionIds = useExamStore((state) => state.incorrectQuestionIds);
    const correctQuestionIds = useExamStore((state) => state.correctQuestionIds);

    const { state, currentQuestion, initializeSession, toggleOption, submitAnswer, nextQuestion } =
        useEndlessSession();

    const { currentIndex, selectedOptions, questions, isRevealed, isFinished } = state;

    useEffect(() => {
        initializeSession(
            getRandomExamQuestions(getTotalQuestionCount(), {
                incorrectIds: incorrectQuestionIds,
                correctIds: correctQuestionIds,
            })
        );
    }, []);

    useEffect(() => {
        if (isFinished) {
            router.replace('/');
        }
    }, [isFinished]);

    if (!currentQuestion || questions.length === 0) {
        return (
            <SafeAreaView style={styles.centerContainer} edges={['bottom', 'left', 'right']}>
                <Stack.Screen options={{ title: 'Loading...' }} />
                <Text style={styles.loadingText}>Loading questions...</Text>
            </SafeAreaView>
        );
    }

    const handleQuit = () => {
        Alert.alert(
            'Quit Endless Mode',
            'Are you sure? Your progress so far has been saved.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Quit', style: 'destructive', onPress: () => router.replace('/') },
            ]
        );
    };

    const handleSubmit = () => {
        if (!currentQuestion || selectedOptions.length === 0) return;
        const selectedSorted = [...selectedOptions].sort();
        const correctSorted = [...currentQuestion.correctAnswers].sort();
        const isCorrect =
            selectedSorted.length === correctSorted.length &&
            selectedSorted.every((val, idx) => val === correctSorted[idx]);
        recordQuestionResult(currentQuestion.id, isCorrect);
        submitAnswer();
    };

    const isLastQuestion = currentIndex >= questions.length - 1;
    const buttonLabel = isRevealed ? (isLastQuestion ? 'Finish' : 'Next Question') : 'Submit';
    const buttonDisabled = !isRevealed && selectedOptions.length === 0;
    const buttonAction = isRevealed ? nextQuestion : handleSubmit;

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <Stack.Screen
                options={{
                    title: `Question ${currentIndex + 1} of ${questions.length}`,
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleQuit} style={{ paddingLeft: 8 }}>
                            <Ionicons name="close" size={28} color={Colors.error} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <QuestionCard
                    question={currentQuestion}
                    selectedOptions={selectedOptions}
                    onOptionToggle={toggleOption}
                    revealed={isRevealed}
                    explanation={currentQuestion.explanation}
                />
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.actionButton, buttonDisabled && styles.actionButtonDisabled]}
                    onPress={buttonAction}
                    disabled={buttonDisabled}
                >
                    <Text style={styles.actionButtonText}>{buttonLabel}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    loadingText: {
        color: Colors.textMuted,
        fontSize: 16,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    bottomBar: {
        padding: 20,
        backgroundColor: Colors.navBar,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    actionButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonDisabled: {
        backgroundColor: '#4A5568',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
```

- [ ] **Step 2: Register the screen in `app/_layout.tsx`**

Add one line inside the `<Stack>` in `_layout.tsx`, after the `review` entry:

```tsx
<Stack.Screen name="endless" options={{ headerBackVisible: false }} />
```

- [ ] **Step 3: Commit**

```bash
git add app/endless.tsx app/_layout.tsx
git commit -m "feat: add endless mode screen"
```

---

## Task 5: Add Endless Mode button to home screen

**Files:**
- Modify: `app/index.tsx`

- [ ] **Step 1: Add the button below "Take Practice Exam"**

In `app/index.tsx`, add a new `Link` block immediately after the "Take Practice Exam" link block (and before the `incorrectQuestionIds.length > 0` conditional):

```tsx
<Link href="/endless" asChild>
    <TouchableOpacity style={[styles.startButton, styles.endlessButton]} activeOpacity={0.8}>
        <Text style={styles.startButtonText}>Endless Mode</Text>
    </TouchableOpacity>
</Link>
```

- [ ] **Step 2: Add the `endlessButton` style**

In the `StyleSheet.create` block, add after `reviewButton`:

```typescript
endlessButton: {
    backgroundColor: '#2D3748',
},
```

- [ ] **Step 3: Verify end-to-end**

Run `npx expo start` and check the full flow:

1. Home screen shows "Endless Mode" button.
2. Tapping it loads the endless screen with `Question 1 of 1198` in the header.
3. Submit is disabled with no answer selected.
4. Selecting an answer enables Submit.
5. Tapping Submit reveals correct/incorrect colours, disables option taps, shows explanation.
6. Button changes to "Next Question".
7. Tapping "Next Question" clears state and advances to question 2.
8. Tapping × shows the quit alert; confirming returns to home.
9. Home dashboard pie chart reflects answers committed so far.
10. On the last question, button reads "Finish"; tapping it returns to home.

- [ ] **Step 4: Commit**

```bash
git add app/index.tsx
git commit -m "feat: add Endless Mode entry point to home screen"
```
