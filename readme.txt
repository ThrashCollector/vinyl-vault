=== Vinyl Vault ===
Contributors: jlopez
Donate link: https://example.com/donate
Tags: discogs, music, collection, vinyl, records, gutenberg, block
Requires at least: 6.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Display your Discogs vinyl collection beautifully on your WordPress site with customizable Gutenberg blocks.

== Description ==

Vinyl Vault is a WordPress Gutenberg block that seamlessly integrates with the Discogs API to display your vinyl record collection on your website. Perfect for music enthusiasts, record collectors, and vinyl stores who want to showcase their collection online.

= Key Features =

* **Multiple Display Modes**: Choose between Grid, List, or Compact layouts
* **Grid Customization**: Configure 1-8 columns for grid layout
* **Customizable Display**: Show or hide artist names, album titles, release years, and record labels
* **Flexible Sorting**: Sort by date added, artist, title, year, label, or catalog number
* **Sort Order Control**: Display in ascending or descending order
* **Interactive Links**: Artist names and album titles link directly to their Discogs pages
* **Pagination Support**: Handle large collections with built-in pagination
* **Responsive Design**: Optimized for all devices with mobile-specific layouts
* **Multiple Blocks**: Support for multiple collection blocks on the same page
* **No API Key Required**: Works with public collections out of the box
* **Private Collection Support**: Optional API key support for private collections
* **Easy to Use**: Simple configuration through the WordPress block editor
* **Performance Optimized**: Efficient API calls with loading states

= Perfect For =

* Record collectors wanting to showcase their collection
* Vinyl stores displaying inventory
* Music bloggers sharing their favorite albums
* DJs showing their record collection
* Music enthusiasts building a digital catalog

= How It Works =

1. Add the Vinyl Vault Collection block to any post or page
2. Enter your Discogs username
3. Configure your display preferences
4. Your collection appears beautifully formatted on your site

The block fetches data directly from the Discogs API, ensuring your displayed collection is always up-to-date with your Discogs account.

== Installation ==

= From WordPress Admin =

1. Navigate to Plugins > Add New
2. Search for "Vinyl Vault"
3. Click Install Now, then Activate
4. Start using the block in any post or page

= Manual Installation =

1. Download the plugin zip file
2. Navigate to Plugins > Add New > Upload Plugin
3. Choose the downloaded file and click Install Now
4. Activate the plugin

= From Source =

1. Clone the repository to your `/wp-content/plugins/` directory
2. Run `npm install` in the plugin directory
3. Run `npm run build` to compile assets
4. Activate the plugin in WordPress admin

== Frequently Asked Questions ==

= Do I need a Discogs API key? =

No, the plugin works with public collections without any API key. You only need an API key if:
- Your collection is set to private on Discogs
- You want to avoid API rate limits for large collections

= How do I get a Discogs API key? =

1. Log in to your Discogs account
2. Go to Settings > Developers
3. Click "Generate new token"
4. Copy the token and paste it in the block settings

= Can I display multiple collections? =

Yes, you can add multiple Discogs Collection blocks to a page, each configured with different usernames.

= What data is displayed from my collection? =

The block can display:
- Album artwork
- Artist name(s)
- Album/release title
- Release year
- Record label(s)

You can toggle each of these on/off in the block settings.

= Is the plugin responsive? =

Yes, the plugin is fully responsive and adapts to different screen sizes automatically.

= How often does the collection update? =

The collection data is fetched fresh each time the page loads, ensuring it's always current with your Discogs account.

== Screenshots ==

1. Block editor settings panel
2. Grid layout display mode
3. List layout display mode
4. Compact layout display mode
5. Pagination controls
6. Mobile responsive view

== Changelog ==

= 1.0.0 =
* Initial release
* Grid, List, and Compact display modes
* Customizable display options
* Pagination support
* API key support for private collections

== Upgrade Notice ==

= 1.0.0 =
Initial release of Discogs Blocks. Start displaying your vinyl collection today!

== Privacy Policy ==

This plugin makes requests to the Discogs API (api.discogs.com) to fetch collection data. No personal data is stored by the plugin itself. The data displayed is publicly available information from Discogs user collections.

For private collections, API tokens are stored in your WordPress database and are only used for authenticating requests to Discogs.

== Credits ==

* Built with @wordpress/scripts and the WordPress Block Editor
* Powered by the Discogs API
* Icon: Music collection icon from WordPress Dashicons