---
description: Verify the UI polish changes
---

1.  **Check Layout Consistency**
    - [ ] `Container` used on `HomePage` (app/page.tsx).
    - [ ] `Container` used on `PlaceDetailsPage` (app/places/[id]/page.tsx).

2.  **Check Component Polish**
    - [ ] `PlaceCard` updated with `font-outfit` and `Article` tag styling removed (using `div` and `Card` styles).
    - [ ] `Button` has `active:scale-95`.

3.  **Check Responsive Design**
    - [ ] `CategoryGrid` uses responsive classes.
    - [ ] `TopPlaces` uses responsive classes.
    - [ ] `SearchPage` uses `PlaceCard` in responsive grid.

4.  **Confirm ScrollToTop**
    - [ ] `ScrollToTop` added to `ClientLayout`.

5.  **Verify Review List**
    - [ ] `ReviewList` has premium styling (rounded corners, shadows).

6.  **Verify Admin**
    - [ ] `Admin` layout uses client layout (no broken components).
