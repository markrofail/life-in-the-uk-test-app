# Home Screen Button Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the home screen action buttons so the two study modes sit side-by-side as equal peers and "Review Incorrect Questions" becomes a lighter ghost button.

**Architecture:** Single-file change to `app/index.tsx`. Replaces the three stacked full-width buttons with a row of two mode buttons plus a ghost-style review button. Old styles (`startButton`, `startButtonText`, `reviewButton`, `endlessButton`) are removed and replaced with a new set.

**Tech Stack:** React Native, StyleSheet. No test runner — verification is by code inspection and manual app run.

---

## File Map

| Action | Path | Change |
|--------|------|--------|
| Modify | `app/index.tsx` | Replace button JSX and styles |

---

## Task 1: Replace button JSX and styles in `app/index.tsx`

**Files:**
- Modify: `app/index.tsx`

- [ ] **Step 1: Replace the buttons JSX block**

Find and replace the entire block from the first `<Link href="/exam"` through the closing `)}` of the review button conditional. Replace with:

```tsx
<View style={styles.modeButtonsRow}>
  <Link href="/exam" asChild>
    <TouchableOpacity style={[styles.modeButton, styles.examButton]} activeOpacity={0.8}>
      <Text style={styles.modeButtonText}>Practice Exam</Text>
    </TouchableOpacity>
  </Link>

  <Link href="/endless" asChild>
    <TouchableOpacity style={[styles.modeButton, styles.endlessButton]} activeOpacity={0.8}>
      <Text style={styles.modeButtonText}>Endless Mode</Text>
    </TouchableOpacity>
  </Link>
</View>

{incorrectQuestionIds.length > 0 && (
  <Link href="/review" asChild>
    <TouchableOpacity style={styles.reviewButton} activeOpacity={0.8}>
      <Text style={styles.reviewButtonText}>Review Incorrect Questions</Text>
    </TouchableOpacity>
  </Link>
)}
```

Make sure `View` is imported from `react-native` — it already is in the current file.

- [ ] **Step 2: Replace the button styles**

In the `StyleSheet.create` block, remove these styles entirely:
- `startButton`
- `startButtonText`
- `reviewButton` (the old dark-red filled version)
- `endlessButton` (the old dark-grey version)

Replace them with:

```typescript
modeButtonsRow: {
  flexDirection: 'row',
  gap: 12,
  marginBottom: 16,
},
modeButton: {
  flex: 1,
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 4,
},
examButton: {
  backgroundColor: Colors.primary,
},
endlessButton: {
  backgroundColor: '#2C7A7B',
},
modeButtonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '700',
},
reviewButton: {
  backgroundColor: 'transparent',
  borderWidth: 1.5,
  borderColor: 'rgba(252, 129, 129, 0.5)',
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 16,
},
reviewButtonText: {
  color: Colors.error,
  fontSize: 18,
  fontWeight: '700',
},
```

- [ ] **Step 3: Verify by inspection**

Read the updated file and confirm:
- The `modeButtonsRow` View wraps both the `/exam` and `/endless` links
- No references to the removed styles (`startButton`, `startButtonText`) remain anywhere in the JSX
- The review button uses `styles.reviewButton` and `styles.reviewButtonText`
- The `resetButton` and `resetButtonText` styles and their JSX are untouched

- [ ] **Step 4: Commit**

```bash
git add app/index.tsx
git commit -m "feat: redesign home screen buttons — side-by-side mode row and ghost review button"
```
