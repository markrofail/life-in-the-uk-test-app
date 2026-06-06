# Home Screen Button Redesign — Design Spec

**Date:** 2026-06-06
**Status:** Approved

## Problem

The home screen has three identically-styled full-width buttons stacked vertically. "Endless Mode" uses an out-of-palette dark grey (`#2D3748`) that clashes with the rest of the UI. All buttons carry the same visual weight despite having different levels of importance. "Review Incorrect Questions" uses an aggressive solid dark-red that feels too prominent for a conditional secondary action.

## Goal

Make the two primary study modes ("Practice Exam" and "Endless Mode") feel like equal peers with appropriate visual treatment, and demote "Review Incorrect Questions" to a visually lighter secondary action.

## Design

### Primary mode buttons — side by side

"Practice Exam" and "Endless Mode" are placed in a `flexDirection: 'row'` container with `gap: 12`. Each button takes `flex: 1` so they split the row equally.

| Button | Label | Background |
|--------|-------|------------|
| Practice Exam | "Practice Exam" | `Colors.primary` (`#3182CE`) — unchanged |
| Endless Mode | "Endless Mode" | Teal `#2C7A7B` — replaces the dark grey |

- Label shortened from "Take Practice Exam" → "Practice Exam" to fit comfortably at half-width
- All other visual properties unchanged: `paddingVertical: 16`, `borderRadius: 12`, shadow, `fontWeight: '700'`, white text
- Row container has `marginBottom: 16` (same spacing as the current individual buttons)

### "Review Incorrect Questions" — outlined button

Replaces the solid dark-red fill with an outlined (ghost) style:

- `backgroundColor: 'transparent'`
- `borderWidth: 1.5`
- `borderColor: rgba(252, 129, 129, 0.5)` (Colors.error at 50% opacity)
- Text colour: `Colors.error` (`#FC8181`)
- All other geometry unchanged (full-width, same padding, same border radius)
- Removes the `shadowColor` / `elevation` (shadows don't suit ghost buttons)

### "Reset Statistics" — unchanged

Text button remains as-is.

## What is explicitly out of scope

- No icon additions
- No changes to the stats pie chart card above the buttons
- No changes to any other screen
