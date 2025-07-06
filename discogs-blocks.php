<?php
/**
 * Plugin Name:       Discogs Blocks
 * Plugin URI:        https://github.com/jlopez/Discogs-blocks
 * Description:       Display your Discogs collection on your WordPress site with Gutenberg blocks
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            jlopez
 * Author URI:        https://github.com/jlopez
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       discogs-blocks
 * Domain Path:       /languages
 *
 * @package           discogs-blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define plugin constants
 */
define( 'DISCOGS_BLOCKS_VERSION', '1.0.0' );
define( 'DISCOGS_BLOCKS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DISCOGS_BLOCKS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function discogs_blocks_init() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'discogs_blocks_render_callback',
	) );
}
add_action( 'init', 'discogs_blocks_init' );

/**
 * Server-side rendering callback for the block
 *
 * @param array $attributes Block attributes.
 * @return string Block markup.
 */
function discogs_blocks_render_callback( $attributes ) {
	// Sanitize attributes
	$username = ! empty( $attributes['username'] ) ? sanitize_text_field( $attributes['username'] ) : '';
	$api_key = ! empty( $attributes['apiKey'] ) ? sanitize_text_field( $attributes['apiKey'] ) : '';
	$display_mode = ! empty( $attributes['displayMode'] ) ? sanitize_text_field( $attributes['displayMode'] ) : 'grid';
	$items_per_page = ! empty( $attributes['itemsPerPage'] ) ? absint( $attributes['itemsPerPage'] ) : 12;
	$grid_columns = ! empty( $attributes['gridColumns'] ) ? absint( $attributes['gridColumns'] ) : 4;
	
	// Ensure display mode is valid
	$valid_modes = array( 'grid', 'list', 'compact' );
	if ( ! in_array( $display_mode, $valid_modes, true ) ) {
		$display_mode = 'grid';
	}
	
	// Ensure items per page is within reasonable bounds
	$items_per_page = max( 1, min( 50, $items_per_page ) );
	
	// Ensure grid columns is within reasonable bounds
	$grid_columns = max( 1, min( 8, $grid_columns ) );
	
	// Build the block markup
	$class_name = 'wp-block-discogs-blocks-collection';
	if ( ! empty( $attributes['align'] ) ) {
		$class_name .= ' align' . $attributes['align'];
	}
	
	$block_content = sprintf(
		'<div class="%s">
			<div class="discogs-collection-container" 
				data-username="%s" 
				data-api-key="%s" 
				data-display-mode="%s" 
				data-items-per-page="%d" 
				data-show-artist="%s" 
				data-show-title="%s" 
				data-show-year="%s" 
				data-show-label="%s"
				data-sort-by="%s"
				data-sort-order="%s"
				data-grid-columns="%d">
				<div class="discogs-collection-loading">%s</div>
			</div>
		</div>',
		esc_attr( $class_name ),
		esc_attr( $username ),
		esc_attr( $api_key ),
		esc_attr( $display_mode ),
		esc_attr( $items_per_page ),
		esc_attr( $attributes['showArtist'] ? 'true' : 'false' ),
		esc_attr( $attributes['showTitle'] ? 'true' : 'false' ),
		esc_attr( $attributes['showYear'] ? 'true' : 'false' ),
		esc_attr( $attributes['showLabel'] ? 'true' : 'false' ),
		esc_attr( ! empty( $attributes['sortBy'] ) ? $attributes['sortBy'] : 'added' ),
		esc_attr( ! empty( $attributes['sortOrder'] ) ? $attributes['sortOrder'] : 'desc' ),
		esc_attr( $grid_columns ),
		esc_html__( 'Loading collection...', 'discogs-blocks' )
	);
	
	return $block_content;
}

/**
 * Load plugin textdomain
 */
function discogs_blocks_load_textdomain() {
	load_plugin_textdomain( 'discogs-blocks', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'discogs_blocks_load_textdomain' );