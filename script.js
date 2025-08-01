document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    let names = []; // This will store the names after they are loaded from musicstore.txt

    // --- Load Names from musicstore.txt ---
    // The fetch API is used to get the content of your local 'musicstore.txt' file.
    fetch('musicstore.txt')
        .then(response => {
            if (!response.ok) {
                // If the file can't be found or there's an issue with the response, throw an error.
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Get the response body as plain text.
        })
        .then(preloadedNamesText => {
            // Split the text by commas, trim whitespace from each name, and remove any empty strings.
            names = preloadedNamesText.split(',').map(name => name.trim()).filter(name => name !== '');
            resultsDiv.textContent = `Successfully loaded ${names.length} names from musicstore.txt.`;
        })
        .catch(error => {
            // Catch any errors during the fetch operation (e.g., file not found).
            console.error('Error loading names from musicstore.txt:', error);
            resultsDiv.textContent = `Error: Could not load names from musicstore.txt. Please ensure the file exists.`;
        });
    // --- End Loading Names ---

    // Event listener for the search button
    searchButton.addEventListener('click', () => {
        performSearch();
    });

    // Allow searching by pressing Enter in the search input
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    /**
     * Executes the search operation based on the current value in the search input.
     */
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        resultsDiv.innerHTML = ''; // Clear previous results

        if (searchTerm === '') {
            resultsDiv.textContent = 'Please enter a name to search.';
            return;
        }

        if (names.length === 0) {
            resultsDiv.textContent = 'Names are still loading or an error occurred. Please try again.';
            return;
        }

        const foundNames = names.filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (foundNames.length > 0) {
            const ul = document.createElement('ul');
            foundNames.forEach(name => {
                const li = document.createElement('li');
                // Create a regular expression for highlighting, case-insensitive
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                // Replace the search term in the name with a highlighted version
                li.innerHTML = name.replace(regex, '<span class="highlight">$1</span>');
                ul.appendChild(li);
            });
            resultsDiv.appendChild(ul);
        } else {
            resultsDiv.textContent = `No names found matching "${searchTerm}".`;
        }
    }
});