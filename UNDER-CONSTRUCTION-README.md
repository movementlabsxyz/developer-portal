# Under Construction Mode

The Movement Developer Portal is currently in under construction mode. All routes except the home page have been temporarily disabled and replaced with an under construction message.

## What's Been Done

1. **Homepage Simplified**: The main homepage now shows a simple "under construction" message with a link to the Movement docs
2. **All Other Routes Disabled**: All other pages (learning-paths, tutorials, developer-tools, etc.) now show an under construction message
3. **Original Code Preserved**: The original Home component has been backed up as `src/pages/Home/Home.backup.tsx`

## Files Modified

- `src/app/page.tsx` - Simplified to only render the basic Home component
- `src/pages/Home/Home.tsx` - Replaced with under construction message
- `src/pages/Home/Home.backup.tsx` - Backup of original Home component
- `src/components/UnderConstruction.tsx` - New reusable under construction component
- All route pages in `src/app/` - Replaced with under construction component
- `src/sass/base/_base.scss` - Added under construction styles

## To Restore Full Functionality

1. Replace the content of `src/pages/Home/Home.tsx` with the content from `src/pages/Home/Home.backup.tsx`
2. Restore the original content of all route pages in `src/app/`
3. Remove the under construction styles from `src/sass/base/_base.scss` if desired

## Current Homepage

The homepage now displays:
- "We're Under Construction" heading
- "See you soon! For now, head over to the Movement docs:" message
- Link to https://docs.movementnetwork.xyz/devs

All other routes redirect to the same under construction message.
