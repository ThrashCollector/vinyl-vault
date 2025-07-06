# Vinyl Vault

A WordPress Gutenberg block that beautifully displays your Discogs vinyl collection on your website.

## Description

Vinyl Vault integrates with the Discogs API to fetch and display your vinyl record collection directly on your WordPress site. The block provides customizable display options and supports multiple layout modes.

## Features

- Display your Discogs collection in Grid, List, or Compact view
- Customizable grid layout with 1-8 columns
- Customizable display options (show/hide artist, title, year, label)
- Sort collections by date added, artist, title, year, label, or catalog number
- Ascending or descending sort order
- Direct links to Discogs pages for artists and albums
- Pagination support for large collections
- Fully responsive design with mobile-optimized layouts
- Support for multiple collection blocks on the same page
- No API key required for public collections
- Optional API key support for private collections

## Installation

1. Clone or download this repository to your WordPress plugins directory:
   ```bash
   cd wp-content/plugins/
   git clone https://github.com/thrashcollector/vinyl-vault.git
   ```

2. Install dependencies:
   ```bash
   cd vinyl-vault
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Activate the plugin in your WordPress admin panel

## Development

To start development with hot-reloading:
```bash
npm start
```

To create a production build:
```bash
npm run build
```

To create a plugin zip file:
```bash
npm run plugin-zip
```

## Usage

1. Add the "Vinyl Vault Collection" block to any post or page
2. Enter your Discogs username in the block settings
3. (Optional) Add your Discogs API token for private collections
4. Configure display options:
   - Display mode (Grid/List/Compact)
   - Grid columns (1-8 columns when using Grid mode)
   - Items per page
   - Show/hide artist, title, year, label
   - Sort by and sort order

## Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- Node.js 14.0 or higher (for development)

## API Information

This plugin uses the Discogs API to fetch collection data. For public collections, no API authentication is required. For private collections or to avoid rate limits, you can obtain an API token from your [Discogs account settings](https://www.discogs.com/settings/developers).

## License

GPL-2.0-or-later