# Leadership headshots

Add profile photos here so they appear on the Leadership page. LinkedIn does not allow embedding profile pictures from their site, so you need to save the images locally.

**Required filenames** (download from each person’s LinkedIn and save with these names):

| File | Person |
|------|--------|
| `sarah-greenberg.jpeg` | Sarah Greenberg |
| `kaspar-marwick.jpeg` | Kaspar Marwick |
| `marcus-clement.jpeg` | Marcus Clement |
| `raya-rehmat.jpeg` | Raya Rehmat |
| `alarick-alfredo-sorto.jpeg` | Alarick Alfredo-Sorto |
| `milana-trigubova.jpeg` | Milana Trigubova |
| `lucia-fernandez-binder.jpeg` | Lucia Fernandez-Binder |
| `diya-shah.jpeg` | Diya Shah |

**How to add photos**

1. Open each person’s LinkedIn profile (links are on the Leadership page).
2. Right‑click their profile photo → “Save image as…” (or similar).
3. Save the file into this `public/leadership/` folder using the filename from the table above.
4. Supported formats: `.jpeg`, `.jpg`, or `.png` (if you use `.png`, update the `photo` field in `src/pages/Leadership.tsx` to match, e.g. `sarah-greenberg.png`).

Until these files exist, each card will show the person’s initials. If a file is missing or fails to load, the initials are shown instead.
