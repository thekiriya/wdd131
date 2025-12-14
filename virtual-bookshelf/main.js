// Optimized main.js
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Cache DOM elements
    const elements = {
        modal: document.getElementById('bookModal'),
        detailsModal: document.getElementById('bookDetailsModal'),
        addButtons: document.querySelectorAll('.add-button'),
        closeButton: document.querySelector('.close-button'),
        closeDetailsButton: document.querySelector('.close-details-button'),
        bookForm: document.getElementById('bookForm'),
        bookCoverUpload: document.getElementById('bookCoverUpload'),
        coverPreview: document.getElementById('coverPreview'),
        ratingContainer: document.getElementById('bookRating'),
        ratingInput: document.getElementById('ratingValue'),
        stars: document.querySelectorAll('#bookRating span'),
        bookTitle: document.getElementById('bookTitle'),
        bookDescription: document.getElementById('bookDescription')
    };
    
    // State variables
    let uploadedBookCoverURL = '';
    let currentShelfIndex = 0;
    let bookCounter = 0;
    let currentRating = 0;
    
    // Initialize
    init();
    
    function init() {
        // Add event listeners
        setupEventListeners();
        
        // Set ARIA labels
        setAriaLabels();
    }
    
    function setupEventListeners() {
        // Book cover upload preview
        elements.bookCoverUpload.addEventListener('change', handleBookCoverUpload);
        
        // Star rating
        if (elements.stars.length) {
            elements.stars.forEach(star => {
                star.addEventListener('click', handleStarClick);
                star.addEventListener('keydown', handleStarKeydown);
                star.addEventListener('mouseover', handleStarMouseover);
                star.setAttribute('tabindex', '0');
                star.setAttribute('role', 'button');
            });
            
            elements.ratingContainer.addEventListener('mouseleave', handleRatingMouseleave);
        }
        
        // Open modal
        elements.addButtons.forEach((button, index) => {
            button.addEventListener('click', () => openModal(index));
            button.setAttribute('aria-label', 'Add new book to shelf ' + (index + 1));
        });
        
        // Close modals
        elements.closeButton.addEventListener('click', closeModal);
        elements.closeDetailsButton.addEventListener('click', closeDetailsModal);
        
        // Close modals when clicking outside
        document.addEventListener('click', handleOutsideClick);
        
        // Close modals with Escape key
        document.addEventListener('keydown', handleEscapeKey);
        
        // Form submission
        elements.bookForm.addEventListener('submit', handleFormSubmit);
        
        // Form validation
        elements.bookTitle.addEventListener('input', validateTitle);
        elements.ratingInput.addEventListener('change', validateRating);
    }
    
    function setAriaLabels() {
        // Set ARIA labels for accessibility
        elements.modal.setAttribute('aria-hidden', 'true');
        elements.modal.setAttribute('aria-modal', 'true');
        elements.modal.setAttribute('role', 'dialog');
        
        elements.detailsModal.setAttribute('aria-hidden', 'true');
        elements.detailsModal.setAttribute('aria-modal', 'true');
        elements.detailsModal.setAttribute('role', 'dialog');
        
        // Set labels for form elements
        elements.bookTitle.setAttribute('aria-label', 'Book title');
        elements.bookCoverUpload.setAttribute('aria-label', 'Book cover image upload');
        elements.bookDescription.setAttribute('aria-label', 'Book description');
    }
    
    function handleBookCoverUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedBookCoverURL = e.target.result;
                elements.coverPreview.style.backgroundImage = `url('${uploadedBookCoverURL}')`;
                elements.coverPreview.textContent = '';
                elements.coverPreview.setAttribute('aria-label', 'Book cover preview');
            };
            reader.readAsDataURL(file);
        }
    }
    
    function handleStarClick() {
        currentRating = parseInt(this.getAttribute('data-value'));
        elements.ratingInput.value = currentRating;
        updateStarRating(currentRating);
        this.focus();
    }
    
    function handleStarKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStarClick.call(this);
        }
    }
    
    function handleStarMouseover() {
        const hoverRating = parseInt(this.getAttribute('data-value'));
        updateStarRating(hoverRating);
    }
    
    function handleRatingMouseleave() {
        updateStarRating(currentRating);
    }
    
    function updateStarRating(rating) {
        elements.stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            const isSelected = starValue <= rating;
            star.classList.toggle('selected', isSelected);
            star.setAttribute('aria-pressed', isSelected);
        });
    }
    
    function openModal(shelfIndex) {
        currentShelfIndex = shelfIndex;
        elements.modal.style.display = 'block';
        elements.modal.setAttribute('aria-hidden', 'false');
        elements.bookTitle.focus();
        
        // Trap focus inside modal
        trapFocus(elements.modal);
    }
    
    function closeModal() {
        elements.modal.style.display = 'none';
        elements.modal.setAttribute('aria-hidden', 'true');
        resetForm();
    }
    
    function closeDetailsModal() {
        elements.detailsModal.style.display = 'none';
        elements.detailsModal.setAttribute('aria-hidden', 'true');
    }
    
    function handleOutsideClick(event) {
        if (event.target === elements.modal) {
            closeModal();
        }
        if (event.target === elements.detailsModal) {
            closeDetailsModal();
        }
    }
    
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            if (elements.modal.style.display === 'block') {
                closeModal();
            }
            if (elements.detailsModal.style.display === 'block') {
                closeDetailsModal();
            }
        }
    }
    
    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Get form values
        const title = elements.bookTitle.value.trim();
        const description = elements.bookDescription.value.trim();
        const rating = elements.ratingInput.value;
        
        // Find the current shelf
        const shelves = document.querySelectorAll('.shelf');
        const currentShelf = shelves[currentShelfIndex];
        
        // Create and add the book
        const newBook = createBookElement(title, rating, description, uploadedBookCoverURL);
        currentShelf.appendChild(newBook);
        
        // Position the book
        positionBookOnShelf(newBook, currentShelf);
        
        // Update add button position
        updateAddButtonPosition(currentShelf);
        
        // Announce to screen readers
        announceToScreenReader(`Added book "${title}" to shelf`);
        
        // Reset and close
        closeModal();
    }
    
    function validateForm() {
        let isValid = true;
        
        if (!elements.bookTitle.value.trim()) {
            showError(elements.bookTitle, 'Please enter a book title');
            isValid = false;
        }
        
        if (!uploadedBookCoverURL) {
            showError(elements.bookCoverUpload, 'Please upload a book cover image');
            isValid = false;
        }
        
        if (!elements.ratingInput.value) {
            showError(elements.ratingContainer, 'Please select a rating');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateTitle() {
        if (this.value.trim()) {
            clearError(this);
        }
    }
    
    function validateRating() {
        if (this.value) {
            clearError(elements.ratingContainer);
        }
    }
    
    function showError(element, message) {
        element.classList.add('error');
        let errorElement = element.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '0.9rem';
            errorElement.style.marginTop = '5px';
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
    }
    
    function clearError(element) {
        element.classList.remove('error');
        const errorElement = element.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
    }
    
    function resetForm() {
        elements.bookForm.reset();
        currentRating = 0;
        elements.ratingInput.value = '';
        uploadedBookCoverURL = '';
        updateStarRating(0);
        elements.coverPreview.style.backgroundImage = '';
        elements.coverPreview.textContent = 'Preview';
        elements.coverPreview.style.backgroundColor = '#eee';
        elements.coverPreview.removeAttribute('aria-label');
        
        // Clear any errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
    
    function createBookElement(title, rating, description, coverImageURL) {
        bookCounter++;
        
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-entry';
        bookDiv.id = `book-${bookCounter}`;
        bookDiv.setAttribute('data-title', title);
        bookDiv.setAttribute('data-description', description);
        bookDiv.setAttribute('data-rating', rating);
        bookDiv.setAttribute('data-cover', coverImageURL);
        bookDiv.setAttribute('tabindex', '0');
        bookDiv.setAttribute('role', 'button');
        bookDiv.setAttribute('aria-label', `${title}, rated ${rating} out of 5 stars`);
        
        // Create cover
        const coverDiv = document.createElement('div');
        coverDiv.className = 'book-cover-final';
        coverDiv.style.backgroundImage = `url('${coverImageURL}')`;
        coverDiv.setAttribute('aria-hidden', 'true');
        
        // Create title
        const titlePara = document.createElement('p');
        titlePara.className = 'book-title-display';
        titlePara.textContent = title;
        
        // Create rating
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'book-rating-display';
        ratingDiv.setAttribute('aria-label', `${rating} out of 5 stars`);
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = i <= rating ? 'book-star selected' : 'book-star';
            star.textContent = '★';
            star.setAttribute('aria-hidden', 'true');
            ratingDiv.appendChild(star);
        }
        
        // Assemble book
        bookDiv.appendChild(coverDiv);
        bookDiv.appendChild(titlePara);
        bookDiv.appendChild(ratingDiv);
        
        // Add event listeners
        bookDiv.addEventListener('click', () => showBookDetails(title, description, rating, coverImageURL));
        bookDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showBookDetails(title, description, rating, coverImageURL);
            }
        });
        
        return bookDiv;
    }
    
    function positionBookOnShelf(book, shelf) {
        const books = shelf.querySelectorAll('.book-entry');
        const position = books.length - 1;
        const bookWidth = 90;
        const leftPosition = 20 + (position * bookWidth);
        
        book.style.left = `${leftPosition}px`;
    }
    
    function updateAddButtonPosition(shelf) {
        const books = shelf.querySelectorAll('.book-entry');
        const addBtn = shelf.querySelector('.add-button');
        
        if (books.length > 0 && addBtn) {
            const lastBook = books[books.length - 1];
            const lastBookRect = lastBook.getBoundingClientRect();
            const shelfRect = shelf.getBoundingClientRect();
            
            const relativeLeft = lastBookRect.left - shelfRect.left + lastBookRect.width + 10;
            addBtn.style.left = `${relativeLeft}px`;
        }
    }
    
    function showBookDetails(title, description, rating, coverImageURL) {
        // Populate details
        document.getElementById('detailsTitle').textContent = title;
        document.getElementById('detailsDescription').textContent = description || 'No description provided.';
        
        const detailsCover = document.getElementById('detailsBookCover');
        detailsCover.style.backgroundImage = `url('${coverImageURL}')`;
        detailsCover.style.backgroundSize = 'cover';
        detailsCover.style.backgroundPosition = 'center';
        detailsCover.textContent = '';
        detailsCover.setAttribute('aria-label', `Cover image for ${title}`);
        
        // Create rating stars
        const detailsRating = document.getElementById('detailsRating');
        detailsRating.innerHTML = '';
        detailsRating.setAttribute('aria-label', `${rating} out of 5 stars`);
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.style.color = i <= rating ? 'gold' : '#ccc';
            star.style.marginRight = '5px';
            star.setAttribute('aria-hidden', 'true');
            detailsRating.appendChild(star);
        }
        
        // Show modal
        elements.detailsModal.style.display = 'block';
        elements.detailsModal.setAttribute('aria-hidden', 'false');
        elements.detailsModal.querySelector('.close-details-button').focus();
        
        // Trap focus
        trapFocus(elements.detailsModal);
    }
    
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', function trapHandler(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
    
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
    
    // Utility function for screen reader only text
    const style = document.createElement('style');
    style.textContent = '.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }';
    document.head.appendChild(style);
});