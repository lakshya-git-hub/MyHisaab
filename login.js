document.addEventListener('DOMContentLoaded', () => {
    const countryCodeDropdownToggle = document.getElementById('country-code-dropdown-toggle');
    const countryDropdown = document.getElementById('country-dropdown');
    const countrySearchInput = document.getElementById('country-search');
    const countryList = document.getElementById('country-list');
    const selectedFlagImg = document.getElementById('selected-flag');
    const selectedCountryCodeSpan = document.getElementById('selected-country-code');
    const phoneInput = document.getElementById('phone');

    // Fetch countries from API and populate the list
    const fetchCountries = async () => {
        try {
            // Using REST Countries API to get country data
            const response = await fetch('https://restcountries.com/v3.1/all');
            const countries = await response.json();

            // Sort countries alphabetically by common name
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

            countryList.innerHTML = ''; // Clear existing list items

            countries.forEach(country => {
                // Some countries might not have a dialing code or a common name
                if (country.idd && country.idd.root && country.cca2 && country.name.common) {
                    const countryCode = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '');
                    const countryName = country.name.common;
                    const countryCodeAlpha2 = country.cca2;
                    const flagImageUrl = `https://flagsapi.com/${countryCodeAlpha2}/flat/32.png`; // Using FlagsAPI for flag images

                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-code', countryCode);
                    listItem.setAttribute('data-country-name', countryName);
                    listItem.innerHTML = `<img src="${flagImageUrl}" alt="${countryName} Flag" class="flag-icon"> ${countryName} ${countryCode}`;
                    
                    countryList.appendChild(listItem);
                }
            });

            // After populating, set default selected country (India +91)
            const indiaListItem = countryList.querySelector('li[data-code="+91"]');
            if (indiaListItem) {
                const indiaCountryCode = indiaListItem.getAttribute('data-code');
                const indiaFlagImgSrc = indiaListItem.querySelector('.flag-icon').src;

                selectedCountryCodeSpan.textContent = indiaCountryCode;
                selectedFlagImg.src = indiaFlagImgSrc;
                selectedFlagImg.alt = "India Flag"; // Set alt text for default
            }

        } catch (error) {
            console.error('Error fetching countries:', error);
            // Optionally display an error message to the user
        }
    };

    // Call the fetch function when the page loads
    fetchCountries();

    // Toggle dropdown visibility
    countryCodeDropdownToggle.addEventListener('click', (event) => {
        countryDropdown.style.display = countryDropdown.style.display === 'block' ? 'none' : 'block';
        if (countryDropdown.style.display === 'block') {
            countrySearchInput.focus(); // Focus search input when dropdown opens
        }
        event.stopPropagation(); // Prevent the document click listener from closing it immediately
    });

    // Filter countries based on search input
    countrySearchInput.addEventListener('input', () => {
        const searchTerm = countrySearchInput.value.toLowerCase();
        const countryItems = countryList.querySelectorAll('li');

        countryItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'flex'; // Use flex because the list items are styled with display: flex
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Select country from list
    countryList.addEventListener('click', (event) => {
        const target = event.target.closest('li');
        if (target) {
            const countryCode = target.getAttribute('data-code');
            const countryName = target.getAttribute('data-country-name');
            const flagImgSrc = target.querySelector('.flag-icon').src;

            selectedCountryCodeSpan.textContent = countryCode;
            selectedFlagImg.src = flagImgSrc; // Update the flag image source
            selectedFlagImg.alt = `${countryName} Flag`; // Update alt text

            countryDropdown.style.display = 'none'; // Hide dropdown after selection

            // Optional: Update the placeholder or value of the phone input based on selected country if needed
            // phoneInput.placeholder = `Enter your phone number for ${countryName}`; // Example
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!countryCodeDropdownToggle.contains(event.target) && !countryDropdown.contains(event.target)) {
            countryDropdown.style.display = 'none';
        }
    });
}); 