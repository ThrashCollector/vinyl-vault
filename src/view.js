/**
 * Frontend script for the Discogs Collection block
 */

document.addEventListener('DOMContentLoaded', function() {
	const containers = document.querySelectorAll('.discogs-collection-container');
	
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
		
		if (!username) {
			container.innerHTML = '<div class="discogs-collection-error">No username provided</div>';
			return;
		}
		
		let currentPage = 1;
		let totalPages = 1;
		let allReleases = [];
		
		async function fetchCollection(page = 1) {
			container.innerHTML = '<div class="discogs-collection-loading">Loading collection...</div>';
			
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
						throw new Error('User not found. Please check the username.');
					} else if (response.status === 401) {
						throw new Error('Authentication failed. Please check your API key.');
					} else if (response.status === 429) {
						throw new Error('Rate limit exceeded. Please try again later or add an API key.');
					}
					throw new Error(`Failed to fetch collection: ${response.statusText}`);
				}
				
				const data = await response.json();
				
				// Validate response data
				if (!data || !data.releases || !Array.isArray(data.releases)) {
					throw new Error('Invalid response from Discogs API');
				}
				
				totalPages = data.pagination ? data.pagination.pages : 1;
				currentPage = page;
				
				renderCollection(data.releases);
				renderPagination();
				
			} catch (error) {
				console.error('Discogs Blocks Error:', error);
				container.innerHTML = `<div class="discogs-collection-error">Error loading collection: ${escapeHtml(error.message)}</div>`;
			}
		}
		
		function escapeHtml(unsafe) {
			return unsafe
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
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
			let html = `<div class="discogs-collection-${displayMode}">`;
			
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
					const labelNames = info.labels.map(label => escapeHtml(label.name)).join(', ');
					html += `<div class="discogs-item-label">${labelNames}</div>`;
				}
				
				html += '</div></div>';
			});
			
			html += '</div>';
			
			container.innerHTML = html;
		}
		
		function renderPagination() {
			if (totalPages <= 1) return;
			
			const paginationHtml = `
				<div class="discogs-pagination">
					<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
					<span class="discogs-page-info">Page ${currentPage} of ${totalPages}</span>
					<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
				</div>
			`;
			
			container.insertAdjacentHTML('beforeend', paginationHtml);
		}
		
		window.changePage = function(page) {
			if (page < 1 || page > totalPages) return;
			currentPage = page;
			fetchCollection(page);
		};
		
		// Initial fetch
		fetchCollection();
	});
});