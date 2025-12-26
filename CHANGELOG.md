# Change Log

All notable changes to the "SCSS to CSS Plus" extension will be documented in this file.

## [0.0.3] - 2025-12-26
### Added
- Improved error reporting: Pop-up modal with specific error details when compilation fails.

## [0.0.2] - 2025-12-12
### Added
- Support for ignoring specific files via comments: `// scss-to-css: no` or `/* scss-to-css: no */`.

## [0.0.1] - 2025-12-12
### Initial Release
- Automatically compiles SCSS/SASS to CSS on save.
- Integrated **PostCSS** and **Autoprefixer**.
- Integrated **CSSNano** for code minification.
- Support for `scssToCssPlus.browserslist` configuration to customize Autoprefixer target browsers.
- Added status bar indicators for compilation status:
  - Yellow: Compiling...
  - Green: Success
  - Red: Failed
- **Media Query Merging**: Automatically merges and sorts scattered `@media` queries (mobile-first).
- Support for generating Source Maps.
- Support for Partials (automatically ignores files starting with `_`).
