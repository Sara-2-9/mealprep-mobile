# Figma Design Specification

The original `.fig` file was inspected in Figma Desktop and decoded locally to verify node geometry and styles. The app targets the supplied 393 × 852 iPhone frame while adapting safe areas on Android and other iPhone sizes.

## Tokens

| Token | Value |
| --- | --- |
| Canvas | `#FDFFFB` |
| Surface | `#F2F2F7` |
| Accent | `#34C759` |
| Ink | `#000000` |
| Secondary text | `#3C3C43` |
| Content width | `353` |
| Horizontal inset | `20` |
| Selection-card radius | `20` |
| Primary-button size | `353 × 72` |

Typography uses the supplied Promo family: Regular, Medium, Semi Bold, and Bold. Production builds embed the fonts through the Expo Font config plugin. The root font hook also loads the same PostScript names at runtime so Expo Go and web previews render the design accurately; the splash screen remains visible until loading completes.

## Shared StepHeader

- Container: `353 × 93`, with a 20-point gap between progress row and title.
- Progress row: `353 × 28`, with a 10-point gap.
- Back surface: `28 × 28`, `#F2F2F7`, fully rounded, containing the 20-point Figma chevron frame.
- Progress track: `315 × 20`, `#F2F2F7`, fully rounded.
- Progress fill: accent green at 25%, 50%, or 75%, with the source 6-point white highlight at `y=3` and 50% opacity.
- Title: Promo Semi Bold, 32/45, aligned to the left edge of the content grid.

## Screens

### 01 Lander

- `MealPrep`: Promo Semi Bold, 48, centered inside a 345 × 67 title region at `x=24`, `y=82`.
- Main supplied image: 200 × 200 at `x=97`, `y=312`.
- Seven food emoji decorations occupy 40 × 40 nodes around the image.
- The central asset and animation are intentionally editable under the brief.

### 02 Budget Selection

- Progress header: 353 × 93 at `x=20`, `y=82`.
- Heading: Promo Semi Bold, 32/45.
- Amount: Promo Semi Bold, 96; initial Figma value `€82`.
- Unit: Promo Medium, 20/28.
- Slider: 345 × 64 at `x=24`, `y=488`; track 345 × 16; thumb 64 × 64.
- Supported range: €25–€150, step €1.

### 03 Dietary Needs Selection

- Cards: 168.5 × 104, two columns, 16 horizontal and vertical gap, radius 20.
- Options: None, Veggie, Vegan, Pescatarian, Gluten free, Dairy free.
- Grid origin: `x=20`, `y=254`; total size 353 × 344.

### 04 Nutritional Goals Selection

- Geometry matches the dietary screen.
- Options: None, High protein, Low sugar, Low fat, Low carbs, Low salt.

### 05 Weekly Meal Plan

- Accent background fills the screen.
- Heading: Promo Semi Bold, 40/56 at `y=82`.
- Cost card: 353 × 72 at `x=20`, `y=150`, radius 16.
- Day selector: seven 47 × 40 pills with 4 spacing at `x=20`, `y=234`.
- Active day uses black fill with white text.
- Meal panel: 337 wide at `x=28`, `y=306`, white with rounded top corners.
- The brief grants freedom for ingredients and recipe content inside this panel; the implementation follows the completed reference variant found in the file.

## Verification method

Each implemented screen must be captured at 393 × 852, compared with the source frame using an opacity overlay or image diff, and checked separately on iOS and Android. Intentional differences must be recorded in `DECISIONS.md`.
