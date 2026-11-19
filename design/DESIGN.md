# Little Tree design notes

## Direction

The v2 reference is `today-v2-concept.png` (1536 x 1024). It replaces the earlier dashboard direction while retaining the existing application, records, and useful school-management screens. The requested Our Little Days feel is interpreted as quiet typography, open lists, restrained green accents, and a single still-life photo. No source or screenshot of Our Little Days was available in this workspace, so this is an interpretation, not a claim of exact visual matching.

## Visual system

- White canvas, very light gray-green sidebar, forest-green primary controls, subtle sage selections, thin dividers.
- Locally bundled DM Sans, with system sans-serif fallbacks. Headings use restrained weight and tight spacing; long content has generous line height.
- 246px desktop navigation, 66px top bar, open content area, and small consistent 6-8px control radii.
- The homepage contains only a welcome, subtle photograph, and three useful rows. Operational features have dedicated pages.
- Small text uses darker muted greens after browser review. Urgent notices use a quiet warm accent and an explicit text label.
- Native modal dialogs supply focus containment and Escape dismissal. Shared edit forms provide validation, busy state, consistent actions, and upload-completion checks.
- At 390px, navigation becomes a drawer, rows stack, feedback becomes one column, and tables scroll inside their containers. Long forms scroll within their dialogs. Reduced motion follows the original base styles.

## Reference comparison

| Reference point | Final implementation |
| --- | --- |
| Calm left navigation | All eight sections in the same order, slim icons, light active state, directory separated below |
| Typography hierarchy | Large sans-serif welcome, smaller section title, compact row labels and actions |
| Subtle visual | A dedicated wide photograph of a ginkgo branch, water glass, and pebble; no cartoon or oversized illustration |
| Simple information density | Three divided rows for menu, activity, and school update; no KPI cards or dashboard grid |
| White space and color | White main surface, softly tinted sidebar, thin rules, restrained green accents |
| Responsive behavior | Separate mobile arrangement preserves the same hierarchy and one-column reading order |

Intentional differences: the working sidebar is narrower than the generated concept; text is smaller to suit a management application; a separately generated photograph has a different leaf placement; the hero is 240px high at the reference width; the three row details reflect live saved data; demo disclosures are explicit. Darker secondary text improves readability compared with the initial implementation. The original dashboard concept remains in the design folder as historical context, not the v2 target.

## Generated assets

All three assets were generated for this project. None contain real children or external branding.

1. `design/today-v2-concept.png`
   - Purpose: full desktop layout reference, 1536 x 1024.
   - Prompt brief: Little Tree kindergarten portal, Apple-inspired minimalism and a quiet Our Little Days feeling; white canvas, pale sidebar, beautiful sans-serif typography, restrained green; eight sections and School Directory; small Principal selector; date, “A little care, every day.”, calm subtitle; a sunlit windowsill still life; three thin rows for menu, activity, and school update; no KPI cards, illustrations, or clutter.
2. `public/assets/quiet-morning.png`
   - Purpose: home photograph, 2172 x 724, wide 3:1 composition.
   - Prompt brief: realistic editorial still life of a delicate green ginkgo twig in a clear water glass beside one smooth pebble, white windowsill, soft morning daylight and garden bokeh, ample quiet space to the left, gentle shadows, muted natural greens, no people, text, or logos.
3. `public/assets/vegetable-pasta.png`
   - Purpose: fictional dish photo used in upload/persistence QA; available as a local sample asset.
   - Prompt brief: a small ceramic bowl of vegetable pasta with tomato, zucchini, and peas on a clean light surface; natural daylight, restrained food photography, realistic texture, no people, text, or branding.

The uploaded sample photo is saved in the preview browser's IndexedDB. A fresh browser starts from the seed data and does not inherit that upload. Original fonts, icons, and previous assets remain local.
