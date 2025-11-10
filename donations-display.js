// Function to display donations along with meals
function displayDonations() {
    console.log('Initializing donation display...');
    
    // Get donations from localStorage
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    console.log('Found donations:', donations);

    // Find or create cards container after view-head
    let cardsContainer = document.querySelector('.cards-container');
    if (!cardsContainer) {
        cardsContainer = document.createElement('div');
        cardsContainer.className = 'cards-container';
        const viewHead = document.querySelector('.view-head');
        if (viewHead && viewHead.parentNode) {
            viewHead.parentNode.insertBefore(cardsContainer, viewHead.nextSibling);
        }
    }

    // Clear existing cards
    cardsContainer.innerHTML = '';

    if (donations.length > 0) {
        // Add donation cards
        donations.forEach(donation => {
            const card = document.createElement('div');
            card.className = 'meal-card fade-in';
            card.setAttribute('data-aos', 'fade-up');
            
            card.innerHTML = `
                <div class="meal-inner">
                    <div class="meal-top">
                        <div class="meal-type" style="background: var(--accent);">
                            <i class="fa-solid fa-utensils"></i> ${donation.type || 'Food Available'}
                        </div>
                        <div class="time-badge">
                            <i class="fa-regular fa-clock"></i> ${donation.expiry || 'Contact for timing'}
                        </div>
                    </div>
                    
                    <h3 class="meal-title">${donation.quantity || 'Quantity not specified'}</h3>
                    
                    <div class="meal-meta">
                        <i class="fa-solid fa-location-dot"></i> ${donation.address || 'Location not specified'}
                    </div>
                    
                    <div class="meal-stats">
                        <span>
                            <i class="fa-solid fa-user"></i> ${donation.name || 'Anonymous'}
                        </span>
                    </div>
                    
                    <div class="meal-footer">
                        <div class="meal-tags">
                            <span class="tag" style="background: var(--accent);">Fresh Donation</span>
                        </div>
                        <div class="meal-actions">
                            <a href="tel:${donation.contact}">
                                <button class="btn-call">
                                    <i class="fa-solid fa-phone"></i> Call
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });
    } else {
        // Show "no donations" message
        cardsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text);">
                <i class="fa-solid fa-bowl-food" style="font-size: 2rem; color: var(--accent); margin-bottom: 1rem;"></i>
                <h3>No food donations found yet</h3>
                <p>Be the first to share food in your area!</p>
            </div>
        `;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing donations display');
    displayDonations();
});