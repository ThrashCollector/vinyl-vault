/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { 
	PanelBody, 
	TextControl, 
	SelectControl, 
	RangeControl,
	ToggleControl,
	Notice
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		username,
		apiKey,
		displayMode,
		itemsPerPage,
		showArtist,
		showTitle,
		showYear,
		showLabel,
		sortBy,
		sortOrder,
		gridColumns
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Vinyl Vault Settings', 'vinyl-vault' ) }>
					<TextControl
						label={ __( 'Discogs Username', 'vinyl-vault' ) }
						value={ username }
						onChange={ ( value ) => setAttributes( { username: value } ) }
						help={ __( 'Enter your Discogs username', 'vinyl-vault' ) }
					/>
					<TextControl
						label={ __( 'API Key', 'vinyl-vault' ) }
						value={ apiKey }
						onChange={ ( value ) => setAttributes( { apiKey: value } ) }
						help={ __( 'Enter your Discogs API key (optional for public collections)', 'vinyl-vault' ) }
						type="password"
					/>
				</PanelBody>
				
				<PanelBody title={ __( 'Display Options', 'vinyl-vault' ) }>
					<SelectControl
						label={ __( 'Display Mode', 'vinyl-vault' ) }
						value={ displayMode }
						options={ [
							{ label: __( 'Grid', 'vinyl-vault' ), value: 'grid' },
							{ label: __( 'List', 'vinyl-vault' ), value: 'list' },
							{ label: __( 'Compact', 'vinyl-vault' ), value: 'compact' },
						] }
						onChange={ ( value ) => setAttributes( { displayMode: value } ) }
					/>
					{ displayMode === 'grid' && (
						<RangeControl
							label={ __( 'Grid Columns', 'vinyl-vault' ) }
							value={ gridColumns }
							onChange={ ( value ) => setAttributes( { gridColumns: value } ) }
							min={ 1 }
							max={ 8 }
							help={ __( 'Number of columns in grid view', 'vinyl-vault' ) }
						/>
					) }
					<RangeControl
						label={ __( 'Items Per Page', 'vinyl-vault' ) }
						value={ itemsPerPage }
						onChange={ ( value ) => setAttributes( { itemsPerPage: value } ) }
						min={ 1 }
						max={ 50 }
					/>
					<ToggleControl
						label={ __( 'Show Artist', 'vinyl-vault' ) }
						checked={ showArtist }
						onChange={ ( value ) => setAttributes( { showArtist: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Title', 'vinyl-vault' ) }
						checked={ showTitle }
						onChange={ ( value ) => setAttributes( { showTitle: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Year', 'vinyl-vault' ) }
						checked={ showYear }
						onChange={ ( value ) => setAttributes( { showYear: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Label', 'vinyl-vault' ) }
						checked={ showLabel }
						onChange={ ( value ) => setAttributes( { showLabel: value } ) }
					/>
				</PanelBody>
				
				<PanelBody title={ __( 'Sort Options', 'vinyl-vault' ) }>
					<SelectControl
						label={ __( 'Sort By', 'vinyl-vault' ) }
						value={ sortBy }
						options={ [
							{ label: __( 'Date Added', 'vinyl-vault' ), value: 'added' },
							{ label: __( 'Artist', 'vinyl-vault' ), value: 'artist' },
							{ label: __( 'Title', 'vinyl-vault' ), value: 'title' },
							{ label: __( 'Year', 'vinyl-vault' ), value: 'year' },
							{ label: __( 'Label', 'vinyl-vault' ), value: 'label' },
							{ label: __( 'Catalog Number', 'vinyl-vault' ), value: 'catno' },
						] }
						onChange={ ( value ) => setAttributes( { sortBy: value } ) }
					/>
					<SelectControl
						label={ __( 'Sort Order', 'vinyl-vault' ) }
						value={ sortOrder }
						options={ [
							{ label: __( 'Ascending', 'vinyl-vault' ), value: 'asc' },
							{ label: __( 'Descending', 'vinyl-vault' ), value: 'desc' },
						] }
						onChange={ ( value ) => setAttributes( { sortOrder: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			
			<div { ...useBlockProps() }>
				{ ! username ? (
					<Notice status="warning" isDismissible={ false }>
						{ __( 'Please enter your Discogs username in the block settings.', 'vinyl-vault' ) }
					</Notice>
				) : (
					<div className="discogs-collection-placeholder">
						<div className="discogs-collection-header">
							<h3>{ __( 'Vinyl Vault', 'vinyl-vault' ) }</h3>
							<p>{ __( 'Username:', 'vinyl-vault' ) } { username }</p>
						</div>
						<div className="discogs-collection-preview">
							<p>{ __( 'Your collection will be displayed here.', 'vinyl-vault' ) }</p>
							<p>{ __( 'Display mode:', 'vinyl-vault' ) } { displayMode }</p>
							<p>{ __( 'Items per page:', 'vinyl-vault' ) } { itemsPerPage }</p>
							<p>{ __( 'Sort by:', 'vinyl-vault' ) } { sortBy } ({ sortOrder })</p>
						</div>
					</div>
				) }
			</div>
		</>
	);
}