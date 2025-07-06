/**
 * Frontend script for the Discogs Collection block
 */

document.addEventListener('DOMContentLoaded', function() {
	const containers = document.querySelectorAll('.discogs-collection-container');
	
	// Helper function to escape HTML
	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
	
	containers.forEach(container => {
		const username = container.dataset.username;
		const apiKey = container.dataset.apiKey;
		const displayMode = container.dataset.displayMode || 'grid';
		const itemsPerPage = parseInt(container.dataset.itemsPerPage) || 12;
		const showArtist = container.dataset.showArtist === 'true';
		const showTitle = container.dataset.showTitle === 'true';
		const showYear = container.dataset.showYear === 'true';
		const showLabel = container.dataset.showLabel === 'true';
		const sortBy = container.dataset.sortBy || 'added';
		const sortOrder = container.dataset.sortOrder || 'desc';
		const gridColumns = parseInt(container.dataset.gridColumns) || 4;
		
		if (!username) {
			container.innerHTML = `<div class="discogs-collection-error">${escapeHtml(window.discogsBlocksL10n?.noUsername || 'No username provided')}</div>`;
			return;
		}
		
		let currentPage = 1;
		let totalPages = 1;
		
		async function fetchCollection(page = 1) {
			container.innerHTML = `<div class="discogs-collection-loading">${escapeHtml(window.discogsBlocksL10n?.loadingCollection || 'Loading collection...')}</div>`;
			
			try {
				const headers = {
					'User-Agent': 'DiscogsBlocksWordPress/1.0'
				};
				if (apiKey) {
					headers['Authorization'] = `Discogs token=${apiKey}`;
				}
				
				// Sanitize username for URL
				const sanitizedUsername = encodeURIComponent(username);
				
				// Discogs API sort parameters
				const sortParams = getSortParams(sortBy, sortOrder);
				const response = await fetch(
					`https://api.discogs.com/users/${sanitizedUsername}/collection/folders/0/releases?page=${page}&per_page=${itemsPerPage}&sort=${sortParams.sort}&sort_order=${sortParams.order}`,
					{ 
						headers,
						mode: 'cors'
					}
				);
				
				if (!response.ok) {
					if (response.status === 404) {
						throw new Error(window.discogsBlocksL10n?.userNotFound || 'User not found. Please check the username.');
					} else if (response.status === 401) {
						throw new Error(window.discogsBlocksL10n?.authFailed || 'Authentication failed. Please check your API key.');
					} else if (response.status === 429) {
						throw new Error(window.discogsBlocksL10n?.rateLimitExceeded || 'Rate limit exceeded. Please try again later or add an API key.');
					}
					throw new Error((window.discogsBlocksL10n?.fetchFailed || 'Failed to fetch collection:') + ' ' + response.statusText);
				}
				
				const data = await response.json();
				
				// Validate response data
				if (!data || !data.releases || !Array.isArray(data.releases)) {
					throw new Error(window.discogsBlocksL10n?.invalidResponse || 'Invalid response from Discogs API');
				}
				
				totalPages = data.pagination ? data.pagination.pages : 1;
				currentPage = page;
				
				renderCollection(data.releases);
				renderPagination();
				
			} catch (error) {
				console.error('Discogs Blocks Error:', error);
				const errorPrefix = window.discogsBlocksL10n?.errorLoading || 'Error loading collection:';
				container.innerHTML = `<div class="discogs-collection-error">${escapeHtml(errorPrefix)} ${escapeHtml(error.message)}</div>`;
			}
		}
		
		function getSortParams(sortBy, sortOrder) {
			// Map our sort options to Discogs API parameters
			const sortMap = {
				'added': 'added',
				'artist': 'artist',
				'title': 'title',
				'year': 'year',
				'label': 'label',
				'catno': 'catno'
			};
			
			return {
				sort: sortMap[sortBy] || 'added',
				order: sortOrder || 'desc'
			};
		}
		
		function renderCollection(releases) {
			let html = `<div class="discogs-collection-${displayMode}" ${displayMode === 'grid' ? `data-columns="${gridColumns}"` : ''}>`;
			
			releases.forEach(release => {
				const info = release.basic_information;
				const imageUrl = info.cover_image || info.thumb;
				
				// Build the release URL - Discogs uses format: /release/{id}
				const releaseUrl = `https://www.discogs.com/release/${release.id}`;
				
				html += '<div class="discogs-item">';
				
				if (imageUrl) {
					html += `<a href="${escapeHtml(releaseUrl)}" target="_blank" rel="noopener noreferrer">`;
					html += `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(info.title)}" class="discogs-item-image" loading="lazy">`;
					html += `</a>`;
				}
				
				html += '<div class="discogs-item-details">';
				
				if (showTitle) {
					html += `<div class="discogs-item-title"><a href="${escapeHtml(releaseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(info.title)}</a></div>`;
				}
				
				if (showArtist && info.artists && info.artists.length > 0) {
					// Create artist links
					const artistLinks = info.artists.map(artist => {
						// Remove disambiguation numbers like "(2)" from artist names
						const cleanName = artist.name.replace(/\s*\(\d+\)\s*$/, '');
						
						// Artists can have an ID for direct linking
						if (artist.id) {
							const artistUrl = `https://www.discogs.com/artist/${artist.id}`;
							return `<a href="${escapeHtml(artistUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(cleanName)}</a>`;
						}
						return escapeHtml(cleanName);
					}).join(', ');
					html += `<div class="discogs-item-artist">${artistLinks}</div>`;
				}
				
				if (showYear && info.year) {
					html += `<div class="discogs-item-year">${escapeHtml(String(info.year))}</div>`;
				}
				
				if (showLabel && info.labels && info.labels.length > 0) {
					// Remove duplicates based on label ID or name
					const uniqueLabels = [];
					const seenLabels = new Set();
					
					info.labels.forEach(label => {
						const identifier = label.id || label.name;
						if (!seenLabels.has(identifier)) {
							seenLabels.add(identifier);
							uniqueLabels.push(label);
						}
					});
					
					// Create label links
					const labelLinks = uniqueLabels.map(label => {
						// Remove disambiguation numbers like "(2)" from label names
						const cleanName = label.name.replace(/\s*\(\d+\)\s*$/, '');
						
						// Labels can have an ID for direct linking
						if (label.id) {
							const labelUrl = `https://www.discogs.com/label/${label.id}`;
							return `<a href="${escapeHtml(labelUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(cleanName)}</a>`;
						}
						return escapeHtml(cleanName);
					}).join(', ');
					html += `<div class="discogs-item-label">${labelLinks}</div>`;
				}
				
				html += '</div></div>';
			});
			
			html += '</div>';
			
			container.innerHTML = html;
		}
		
		function renderPagination() {
			if (totalPages <= 1) return;
			
			const prevText = window.discogsBlocksL10n?.previous || 'Previous';
			const nextText = window.discogsBlocksL10n?.next || 'Next';
			const pageInfoText = window.discogsBlocksL10n?.pageInfo || 'Page %1$s of %2$s';
			const pageInfo = pageInfoText.replace('%1$s', currentPage).replace('%2$s', totalPages);
			
			const paginationHtml = `
				<div class="discogs-pagination">
					<button class="discogs-prev-page" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>${escapeHtml(prevText)}</button>
					<span class="discogs-page-info">${escapeHtml(pageInfo)}</span>
					<button class="discogs-next-page" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>${escapeHtml(nextText)}</button>
				</div>
			`;
			
			container.insertAdjacentHTML('beforeend', paginationHtml);
			
			// Add event listeners to the pagination buttons for this specific container
			const pagination = container.querySelector('.discogs-pagination');
			if (pagination) {
				pagination.addEventListener('click', function(e) {
					if (e.target.matches('button:not(:disabled)')) {
						const page = parseInt(e.target.dataset.page);
						if (page && page >= 1 && page <= totalPages) {
							currentPage = page;
							fetchCollection(page);
						}
					}
				});
			}
		}
		
		// Initial fetch
		fetchCollection();
	});
});