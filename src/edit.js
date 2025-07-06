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
		sortOrder
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Discogs Settings', 'discogs-blocks' ) }>
					<TextControl
						label={ __( 'Discogs Username', 'discogs-blocks' ) }
						value={ username }
						onChange={ ( value ) => setAttributes( { username: value } ) }
						help={ __( 'Enter your Discogs username', 'discogs-blocks' ) }
					/>
					<TextControl
						label={ __( 'API Key', 'discogs-blocks' ) }
						value={ apiKey }
						onChange={ ( value ) => setAttributes( { apiKey: value } ) }
						help={ __( 'Enter your Discogs API key (optional for public collections)', 'discogs-blocks' ) }
						type="password"
					/>
				</PanelBody>
				
				<PanelBody title={ __( 'Display Options', 'discogs-blocks' ) }>
					<SelectControl
						label={ __( 'Display Mode', 'discogs-blocks' ) }
						value={ displayMode }
						options={ [
							{ label: __( 'Grid', 'discogs-blocks' ), value: 'grid' },
							{ label: __( 'List', 'discogs-blocks' ), value: 'list' },
							{ label: __( 'Compact', 'discogs-blocks' ), value: 'compact' },
						] }
						onChange={ ( value ) => setAttributes( { displayMode: value } ) }
					/>
					<RangeControl
						label={ __( 'Items Per Page', 'discogs-blocks' ) }
						value={ itemsPerPage }
						onChange={ ( value ) => setAttributes( { itemsPerPage: value } ) }
						min={ 1 }
						max={ 50 }
					/>
					<ToggleControl
						label={ __( 'Show Artist', 'discogs-blocks' ) }
						checked={ showArtist }
						onChange={ ( value ) => setAttributes( { showArtist: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Title', 'discogs-blocks' ) }
						checked={ showTitle }
						onChange={ ( value ) => setAttributes( { showTitle: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Year', 'discogs-blocks' ) }
						checked={ showYear }
						onChange={ ( value ) => setAttributes( { showYear: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Label', 'discogs-blocks' ) }
						checked={ showLabel }
						onChange={ ( value ) => setAttributes( { showLabel: value } ) }
					/>
				</PanelBody>
				
				<PanelBody title={ __( 'Sort Options', 'discogs-blocks' ) }>
					<SelectControl
						label={ __( 'Sort By', 'discogs-blocks' ) }
						value={ sortBy }
						options={ [
							{ label: __( 'Date Added', 'discogs-blocks' ), value: 'added' },
							{ label: __( 'Artist', 'discogs-blocks' ), value: 'artist' },
							{ label: __( 'Title', 'discogs-blocks' ), value: 'title' },
							{ label: __( 'Year', 'discogs-blocks' ), value: 'year' },
							{ label: __( 'Label', 'discogs-blocks' ), value: 'label' },
							{ label: __( 'Catalog Number', 'discogs-blocks' ), value: 'catno' },
						] }
						onChange={ ( value ) => setAttributes( { sortBy: value } ) }
					/>
					<SelectControl
						label={ __( 'Sort Order', 'discogs-blocks' ) }
						value={ sortOrder }
						options={ [
							{ label: __( 'Ascending', 'discogs-blocks' ), value: 'asc' },
							{ label: __( 'Descending', 'discogs-blocks' ), value: 'desc' },
						] }
						onChange={ ( value ) => setAttributes( { sortOrder: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			
			<div { ...useBlockProps() }>
				{ ! username ? (
					<Notice status="warning" isDismissible={ false }>
						{ __( 'Please enter your Discogs username in the block settings.', 'discogs-blocks' ) }
					</Notice>
				) : (
					<div className="discogs-collection-placeholder">
						<div className="discogs-collection-header">
							<h3>{ __( 'Discogs Collection', 'discogs-blocks' ) }</h3>
							<p>{ __( 'Username:', 'discogs-blocks' ) } { username }</p>
						</div>
						<div className="discogs-collection-preview">
							<p>{ __( 'Your collection will be displayed here.', 'discogs-blocks' ) }</p>
							<p>{ __( 'Display mode:', 'discogs-blocks' ) } { displayMode }</p>
							<p>{ __( 'Items per page:', 'discogs-blocks' ) } { itemsPerPage }</p>
							<p>{ __( 'Sort by:', 'discogs-blocks' ) } { sortBy } ({ sortOrder })</p>
						</div>
					</div>
				) }
			</div>
		</>
	);
}