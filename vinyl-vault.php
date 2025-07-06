<?php
/**
 * Plugin Name:       Vinyl Vault
 * Plugin URI:        https://github.com/thrashcollector/vinyl-vault
 * Description:       Display your Discogs vinyl collection beautifully on your WordPress site
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            jlopez
 * Author URI:        https://github.com/jlopez
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       vinyl-vault
 * Domain Path:       /languages
 *
 * @package           vinyl-vault
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define plugin constants
 */
define( 'VINYL_VAULT_VERSION', '1.0.0' );
define( 'VINYL_VAULT_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'VINYL_VAULT_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function vinyl_vault_init() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'vinyl_vault_render_callback',
	) );
}
add_action( 'init', 'vinyl_vault_init' );

/**
 * Enqueue block assets and localize script
 */
function vinyl_vault_enqueue_scripts() {
	// Only localize if our block script is enqueued
	if ( wp_script_is( 'vinyl-vault-collection-view-script' ) ) {
		wp_localize_script(
			'vinyl-vault-collection-view-script',
			'vinylVaultL10n',
			array(
				'noUsername' => __( 'No username provided', 'vinyl-vault' ),
				'loadingCollection' => __( 'Loading collection...', 'vinyl-vault' ),
				'userNotFound' => __( 'User not found. Please check the username.', 'vinyl-vault' ),
				'authFailed' => __( 'Authentication failed. Please check your API key.', 'vinyl-vault' ),
				'rateLimitExceeded' => __( 'Rate limit exceeded. Please try again later or add an API key.', 'vinyl-vault' ),
				'fetchFailed' => __( 'Failed to fetch collection:', 'vinyl-vault' ),
				'errorLoading' => __( 'Error loading collection:', 'vinyl-vault' ),
				'invalidResponse' => __( 'Invalid response from Discogs API', 'vinyl-vault' ),
				'previous' => __( 'Previous', 'vinyl-vault' ),
				'next' => __( 'Next', 'vinyl-vault' ),
				'pageInfo' => __( 'Page %1$s of %2$s', 'vinyl-vault' ),
			)
		);
	}
}
add_action( 'wp_enqueue_scripts', 'vinyl_vault_enqueue_scripts', 20 );

/**
 * Server-side rendering callback for the block
 *
 * @param array $attributes Block attributes.
 * @return string Block markup.
 */
function vinyl_vault_render_callback( $attributes ) {
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
	$class_name = 'wp-block-vinyl-vault-collection';
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
function vinyl_vault_load_textdomain() {
	load_plugin_textdomain( 'vinyl-vault', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'vinyl_vault_load_textdomain' );