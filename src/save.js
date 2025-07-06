/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	
	return (
		<div { ...blockProps }>
			<div 
				className="discogs-collection-container"
				data-username={ attributes.username }
				data-api-key={ attributes.apiKey }
				data-display-mode={ attributes.displayMode }
				data-items-per-page={ attributes.itemsPerPage }
				data-show-artist={ attributes.showArtist }
				data-show-title={ attributes.showTitle }
				data-show-year={ attributes.showYear }
				data-show-label={ attributes.showLabel }
				data-sort-by={ attributes.sortBy }
				data-sort-order={ attributes.sortOrder }
				data-grid-columns={ attributes.gridColumns }
			>
				<div className="discogs-collection-loading">Loading collection...</div>
			</div>
		</div>
	);
}