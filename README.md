# Discogs Blocks

A WordPress Gutenberg block that allows users to display their Discogs collection on their website.

## Description

Discogs Blocks integrates with the Discogs API to fetch and display your vinyl record collection directly on your WordPress site. The block provides customizable display options and supports multiple layout modes.

## Features

- Display your Discogs collection in Grid, List, or Compact view
- Customizable display options (show/hide artist, title, year, label)
- Sort collections by date added, artist, title, year, label, or catalog number
- Ascending or descending sort order
- Pagination support for large collections
- Responsive design
- No API key required for public collections
- Optional API key support for private collections

## Installation

1. Clone or download this repository to your WordPress plugins directory:
   ```bash
   cd wp-content/plugins/
   git clone https://github.com/jlopez/Discogs-blocks.git
   ```

2. Install dependencies:
   ```bash
   cd Discogs-blocks
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

1. Add the "Discogs Collection" block to any post or page
2. Enter your Discogs username in the block settings
3. (Optional) Add your Discogs API token for private collections
4. Configure display options:
   - Display mode (Grid/List/Compact)
   - Items per page
   - Show/hide artist, title, year, label

## Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- Node.js 14.0 or higher (for development)

## API Information

This plugin uses the Discogs API to fetch collection data. For public collections, no API authentication is required. For private collections or to avoid rate limits, you can obtain an API token from your [Discogs account settings](https://www.discogs.com/settings/developers).

## License

GPL-2.0-or-later