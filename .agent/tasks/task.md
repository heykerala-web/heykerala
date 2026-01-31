---
description: Implement Dynamic Category-Based Explore System
---

# Goals
1.  **Create Dynamic Category Page**: implement `/explore/category/[category]` to fetch and display places by category.
2.  **Update Navigation**: Point "Where to go" and Homepage category cards to the new dynamic pages.
3.  **Enhance Place Card**: Ensure cards are clickable and navigate to details.
4.  **Admin Updates**: Ensure all required categories (e.g., Island) are available in the Admin Place Form.

# Plan
1.  **Create Category Page**:
    - File: `client/app/explore/category/[category]/page.tsx`
    - Logic: Fetch places from `/api/places?category=[category]`. Handle loading, empty states, and standard display.
    - Features: Search bar (client-side filtering or server-side), Grid of PlaceCards.

2.  **Update PlaceCard**:
    - File: `client/components/place-card.tsx`
    - Action: Wrap content in `Link` to `/places/[id]`.

3.  **Update Homepage & Where-to-go**:
    - File: `client/components/category-grid.tsx`
    - File: `client/app/where-to-go/page.tsx`
    - Action: Update `href`s to match `/explore/category/[CategoryName]`. Ensure proper mapping (e.g. "Hills" -> "Hill Station").

4.  **Update Admin Form**:
    - File: `client/components/admin/PlaceForm.tsx`
    - Action: Add "Island" to categories list.

5.  **Verify**:
    - Check if clicking a category on homepage loads the list.
    - Check if clicking a place loads details.
