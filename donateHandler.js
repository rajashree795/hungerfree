// Function to save donation to local storage
function saveDonation(donation) {
    // Get existing donations or initialize empty array
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Add new donation with additional fields
    donation.id = Date.now().toString();
    donation.status = 'available';
    donation.timestamp = new Date().toISOString();
    donation.city = donation.address.split(',').pop().trim(); // Extract city from address
    
    // Add to beginning of array (newest first)
    donations.unshift(donation);
    
    // Save back to localStorage
    localStorage.setItem('donations', JSON.stringify(donations));
}

// Handle donate form submission
document.addEventListener('DOMContentLoaded', () => {
    const donateForm = document.getElementById('donateForm');
    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const donation = {
                name: document.getElementById('d_name').value,
                contact: document.getElementById('d_contact').value,
                type: document.getElementById('d_food').value,
                quantity: document.getElementById('d_qty').value,
                address: document.getElementById('d_address').value,
                expiry: document.getElementById('d_expiry').value
            };

            // Save donation
            saveDonation(donation);

            // Show success message
            alert('Thank you! Your donation has been listed successfully.');

            // Reset form
            donateForm.reset();
        });
    }
});