# Change Log

All notable changes to the "SCSS to CSS Plus" extension will be documented in this file.

## [0.0.2] - 2025-12-12
### Added
- Added support for ignoring specific files using comments: `// scss-to-css: no` or `/* scss-to-css: no */`.

## [0.0.1] - 2025-12-09
### Initial Release
- Auto compile SCSS/SASS to CSS on save.
- Integrated **PostCSS** with **Autoprefixer**.
- Integrated **CSSNano** for minification.
- Support for Source Maps.
- Support for partials (files starting with `_` are ignored).
- support (`scssToCssPlus.browserslist`) to customize Autoprefixer targets.
- Added Status Bar indicators for compilation status:
  - Yellow: Compiling...
  - Green: Success
  - Red: Error
- Automatically merges and sorts scattered `@media` queries (mobile-first).

