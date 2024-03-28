// client.js

document.addEventListener('DOMContentLoaded', () => {
    // Existing code for handling search and displaying search results

    searchForm.addEventListener('submit', async (event) => {
        // Existing code for handling search

        searchResults.forEach(result => {
            // Existing code for displaying search results

            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = 'Favorite';
            favoriteButton.addEventListener('click', async () => {
                try {
                    const response = await fetch('/favorites', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(result)
                    });

                    if (response.ok) {
                        alert(`Added "${result.Title}" to favorites!`);
                    } else {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to add to favorites.');
                    }
                } catch (error) {
                    console.error('Error adding to favorites:', error.message);
                    alert('Error adding to favorites. Please try again.');
                }
            });

            resultDiv.appendChild(favoriteButton);
            searchResultsDiv.appendChild(resultDiv);
        });
    });
});
