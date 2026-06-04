# Confidence & Hallucination Scoring Management Module

This document describes how the **Confidence & Hallucination Scoring** experience works in the TruthLens mobile app: what it is for, what the user can do, and how filtering and validation behave.

## Purpose

The module helps users **review past text analyses** that have been scored for confidence and related signals. It is the place to:

- See a **chronological list of scored reports** (Scoring History).
- **Search** and **filter** history by **risk level** and **numeric confidence range**.
- Open a **full report** for details, **delete** a record, or **re-run analysis** on the same text from the **Analyze** flow.

In the app’s bottom tab bar, this experience is the **Scoring** tab, implemented by `HistoryScreen` ([`mobile/src/screens/HistoryScreen.js`](../mobile/src/screens/HistoryScreen.js)).

> **Note:** A separate **Confidence Analytics** screen ([`ScoringDashboardScreen`](../mobile/src/screens/ScoringDashboardScreen.js)) exists for admin-style summary views. The primary end-user “scoring management” list and filters live on **Scoring History** as described below.

## Data flow

1. On load (and on pull-to-refresh or header refresh), the screen calls **`getAllAnalyses()`** to load analysis records from the backend.
2. If the API returns **no rows** or **fails**, the screen falls back to **`sampleHistory`** for development/demo continuity.
3. Each list row is a **`HistoryCard`** ([`mobile/src/components/HistoryCard.js`](../mobile/src/components/HistoryCard.js)) bound to one analysis object (fields such as `score`, `originalResponse` / `originalText`, `createdAt`, `issues`, `extractedClaims`, etc.).

## Key features (Scoring History)

### List and header

- **Title:** “Scoring History”
- **Refresh:** Icon in the header and pull-to-refresh both reload the list from the API
- **Search:** Free-text search over `originalResponse` and `originalText` (case-insensitive)

### Risk level filter (pill bar)

Under **RECENT REPORTS**, a horizontal row of **single-select** pills:

| Pill        | Meaning (derived from score) |
|------------|------------------------------|
| **All**    | No risk filter               |
| **Low Risk**   | Score 70–100 (inclusive) |
| **Medium Risk** | Score 40–69 (inclusive) |
| **High Risk**   | Score 0–39 (inclusive)   |

Score interpretation:

- Values between **0 and 1** are treated as **fractions** and scaled to **0–100** (e.g. `0.85` → 85).
- Other numbers are **clamped** to **0–100**.

The risk label on each card is the **inverse framing** of raw confidence: high score → **LOW RISK**, mid → **MEDIUM RISK**, low → **HIGH RISK**, with fixed colors (see below).

### Confidence range filter

Below the risk pills, **Confidence Range** provides:

- **Min** and **Max** numeric inputs (defaults **0** and **100**).
- Filtering uses the **applied** range only when inputs **pass validation** (see [Validations](#confidence-range-validations)).
- The range filter is **combined with** search and risk filter: a card must satisfy **all** active conditions.

### Report cards (`HistoryCard`)

Each card shows:

- **Date** of the analysis
- **Preview** of the original text (truncated)
- **Circular verification ring** with **percentage** (same numeric score as elsewhere on the card)
- **Risk badge** next to the ring (e.g. `● LOW RISK`)
- **VERIFICATION SCORE** row: percentage + matching risk pill
- **Issues** and **Claims** counts where present on the model

**Color consistency:** Ring arc, percentage text, risk badges, and the highlighted scoring strip share **one** color per card, derived from the same risk mapping:

| Normalized score | Risk label   | Color     |
|-------------------|--------------|-----------|
| 70–100            | LOW RISK     | `#00C896` |
| 40–69             | MEDIUM RISK  | `#F5A623` |
| 0–39              | HIGH RISK    | `#E05252` |

### Actions (unchanged by filters)

- **Tap card** → navigates to **Report Detail** with that report.
- **Delete** → confirmation dialog, then API delete; item removed from local list on success.
- **Reanalyse** → navigates to **Analyze** with the original text prefilled.

## Confidence range validations

Inputs are validated **on change**. If validation **fails**, **range filtering is not updated**: the list keeps the **last valid** applied min/max until the user fixes the inputs.

| Rule | Error message |
|------|----------------|
| Min or Max empty | `Please enter both Min and Max values.` |
| Non-numeric (non-digit characters) | `Only numeric values are allowed.` |
| Value &lt; 0 | `Value cannot be less than 0.` |
| Value &gt; 100 | `Value cannot exceed 100.` |
| Min &gt; Max | `Min value cannot be greater than Max.` |
| Min equals Max | `Min and Max cannot be the same value.` |

Errors appear **inline under the offending field** in red `#E05252`.

**Reset:** Valid **Min = 0** and **Max = 100** restores the default full **0–100** inclusive range for filtering (together with search and risk selection).

## Empty state

When **no cards** match the **combined** filters (search + risk + confidence range), the screen shows:

`No reports match your current filters.`

## Quick reference: filter evaluation order

For each analysis row:

1. **Search** — text must match the search query (or search is empty → passes).
2. **Risk pill** — if not “All”, normalized score must fall in that risk band.
3. **Confidence range** — normalized score must be **≥ applied Min** and **≤ applied Max** (only after inputs validate).

All steps must pass for the card to appear.
