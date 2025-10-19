// 1. DATA DEFINITION (Arrays/Objects for Packages)
const packagesData = [
    { id: 'alp-trek', destination: 'Swiss Alps, Switzerland', durationDays: 7, basePrice: 2999, season: 'Winter', highlights: 'Mountain hiking, scenic train, chalet stay.' },
    { id: 'bali-bliss', destination: 'Ubud & Seminyak, Indonesia', durationDays: 10, basePrice: 1750, season: 'Summer', highlights: 'Yoga retreat, temple visits, private villa.' },
    { id: 'sam-hist', destination: 'Tokyo & Kyoto, Japan', durationDays: 14, basePrice: 4500, season: 'Spring', highlights: 'Bullet train travel, ancient temples, local cuisine.' },
    { id: 'pat-exp', destination: 'Torres del Paine, Chile', durationDays: 5, basePrice: 2200, season: 'Autumn', highlights: 'Glacier viewing, guided trekking, all-inclusive camps.' }
];

// 2. PACKAGES PAGE LOGIC (Table Rendering, Loops, Pricing)
function calculateFinalPrice(basePrice, durationDays, season) {
    let finalPrice = basePrice;
    let multiplier = 1.0;
    let surcharge = 0;

    switch (season) {
        case 'Summer':
            multiplier = 1.15; 
            break;
        case 'Winter':
            multiplier = 0.95; 
            break;
        case 'Spring':
            surcharge = 150; 
            break;
    }
    finalPrice = (finalPrice * multiplier) + surcharge;
    if (durationDays >= 10) {
        finalPrice -= 200; 
    }
    return Math.round(finalPrice);
}

function renderPackagesTable() {
    const tableBody = document.getElementById('packages-table-body');
    if (!tableBody) return; 
    packagesData.forEach(pkg => {
        const finalPrice = calculateFinalPrice(pkg.basePrice, pkg.durationDays, pkg.season);
        
        const row = tableBody.insertRow();
        row.setAttribute('data-package-id', pkg.id); 

        row.innerHTML = `
            <td>${pkg.destination}</td>
            <td>${pkg.durationDays} Days</td>
            <td>$${pkg.basePrice.toLocaleString()}</td>
            <td>${pkg.season}</td>
            <td>$${finalPrice.toLocaleString()}</td>
            <td>${pkg.highlights}</td>
        `;
    });
}
// 3. BOOKING FORM LOGIC (Price Calculation, Validation)
function updateBookingPrice() {
    const form = document.getElementById('booking-form');
    if (!form) return; 
    const startDateInput = form.start_date.value;
    const endDateInput = form.end_date.value;
    const selectedPackageId = form.package_selection.value;
    const guests = parseInt(form.guests.value);
    const promoCode = form.promo_code.value.toUpperCase();
    const totalDisplay = document.getElementById('estimated-total');
    const submitBtn = form.querySelector('button[type="submit"]');

    let basePackagePrice = 0;
    let nights = 0;
    const isDateValid = startDateInput && endDateInput;
    if (isDateValid) {
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);
        const diffTime = endDate.getTime() - startDate.getTime();
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    }
    const isFormValid = form.name.value && selectedPackageId && guests >= 1 && nights > 0;
    
    if (!isFormValid) {
        totalDisplay.textContent = 'Please complete all required fields and ensure dates are valid.';
        submitBtn.disabled = true;
        return;
    }
    const selectedPackage = packagesData.find(p => p.id === selectedPackageId);
    if (selectedPackage) {
        basePackagePrice = calculateFinalPrice(selectedPackage.basePrice, selectedPackage.durationDays, selectedPackage.season);
    } else {
        totalDisplay.textContent = 'Please select a package.';
        submitBtn.disabled = true;
        return;
    }
    
    submitBtn.disabled = false; 
    
    let finalCost = basePackagePrice;

    const packageNights = selectedPackage.durationDays - 1; 
    if (nights !== packageNights && packageNights > 0) {
        finalCost = (finalCost / packageNights) * nights;
    }
    if (guests > 2) {
        finalCost *= (1 + (guests - 2) * 0.20); 
    }
    
    switch (promoCode) {
        case 'EARLYBIRD':
            finalCost *= 0.90; 
            break;
        case 'WELCOME20':
            finalCost -= 200; 
            break;
        case 'GLOBETROTTER':
            finalCost *= 0.85; 
            break;
    }
    
    totalDisplay.textContent = `$${Math.round(finalCost).toLocaleString()} USD`;
}
function validateAndSubmit(event) {
    const form = document.getElementById('booking-form');
    if (!form) return;

    if (form.querySelector('button[type="submit"]').disabled) {
        event.preventDefault();
        alert("Please check the form: Ensure all fields are valid, dates are correct, and a package is selected.");
    } else {
        event.preventDefault(); 
        alert("Booking request submitted successfully!\nEstimated total: " + document.getElementById('estimated-total').textContent + 
              "\n(In a real application, this data would now be sent to a server.)");
        form.reset();
        updateBookingPrice();
    }
}

// 4. GALLERY LOGIC (Modal with Data Attributes

function setupGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item-js');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');

    if (!modal) return; // Stop if not on the gallery page

    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const largeSrc = item.getAttribute('data-large-src');
            const caption = item.getAttribute('data-caption');
            modalImg.src = largeSrc;
            modalImg.alt = caption;
            modalCaption.textContent = caption;
            modal.style.display = 'block';
        });
    });
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}
// 5. NAVIGATION HIGHLIGHT (CSS via JS)
function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        link.classList.remove('active-nav'); 
        if (linkPath === currentPath) {
            link.classList.add('active-nav');
        }
    });
}
// 6. INITIALIZATION

document.addEventListener('DOMContentLoaded', () => {
    highlightActiveNav();
    renderPackagesTable();
    setupGalleryModal();

    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('change', updateBookingPrice); 
        bookingForm.addEventListener('keyup', updateBookingPrice); 
        updateBookingPrice(); 
        bookingForm.addEventListener('submit', validateAndSubmit);
    }
});