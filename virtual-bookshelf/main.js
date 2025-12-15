document.addEventListener('DOMContentLoaded', function() {
    // Variable to hold the uploaded image data
    let uploadedBookCoverURL = '';
    let currentShelfIndex = 0; // Track which shelf we're adding to

    // -- 1. SETUP MODAL ELEMENTS --
    const modal = document.getElementById('bookModal');
    const addButton = document.querySelector('.add-button');
    const closeButton = document.querySelector('.close-button');
    const bookForm = document.getElementById('bookForm');

    // -- 2. STAR RATING ELEMENTS --
    const ratingContainer = document.getElementById('bookRating');
    const ratingInput = document.getElementById('ratingValue');
    const stars = ratingContainer ? ratingContainer.querySelectorAll('span') : [];
    let currentRating = 0;

    // -- 3. MODAL OPEN/CLOSE LOGIC --
    if (addButton) {
        addButton.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
                resetForm();
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetForm();
        }
    });

    // -- 4. STAR RATING LOGIC --
    function updateStarRating(rating) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                currentRating = parseInt(this.getAttribute('data-value'));
                ratingInput.value = currentRating;
                updateStarRating(currentRating);
            });

            star.addEventListener('mouseover', function() {
                updateStarRating(parseInt(this.getAttribute('data-value')));
            });
        });

        ratingContainer.addEventListener('mouseleave', function() {
            updateStarRating(currentRating);
        });
    }

    // -- 5. INITIAL BOOK COVER UPLOAD LOGIC --
    const initialBookCoverInput = document.getElementById('bookCoverInput1');
    const initialBookCoverDisplay = document.getElementById('bookCoverDisplay1');

    if (initialBookCoverInput && initialBookCoverDisplay) {
        initialBookCoverInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Save the uploaded image
                    uploadedBookCoverURL = e.target.result;
                    initialBookCoverDisplay.style.backgroundImage = `url('${uploadedBookCoverURL}')`;
                    initialBookCoverDisplay.textContent = '';
                    initialBookCoverDisplay.style.backgroundSize = 'cover';
                    initialBookCoverDisplay.style.backgroundPosition = 'center';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // -- 6. FORM SUBMIT HANDLER --
    if (bookForm) {
        bookForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form values
            const title = document.getElementById('bookTitle').value.trim();
            const description = document.getElementById('bookDescription').value.trim();
            const rating = ratingInput.value;

            if (!title) {
                alert('Please enter a book title');
                return;
            }

            if (!rating) {
                alert('Please select a rating');
                return;
            }

            // Find the current shelf
            const shelves = document.querySelectorAll('.shelf');
            const currentShelf = shelves[currentShelfIndex];

            // Create and add the book
            const newBook = createBookElement(title, rating, description, uploadedBookCoverURL);
            currentShelf.appendChild(newBook);

            // Make the book clickable to show details
            newBook.addEventListener('click', function() {
                showBookDetails(title, description, rating, uploadedBookCoverURL);
            });

            // Move to next position for next book
            updateBookPosition(currentShelf);

            // Reset everything
            modal.style.display = 'none';
            resetForm();
        });
    }

    // -- 7. HELPER FUNCTIONS --
    function resetForm() {
        bookForm.reset();
        currentRating = 0;
        ratingInput.value = '';
        uploadedBookCoverURL = '';
        updateStarRating(0);
        
        // Reset the book cover display
        if (initialBookCoverDisplay) {
            initialBookCoverDisplay.style.backgroundImage = '';
            initialBookCoverDisplay.textContent = '📚';
            initialBookCoverDisplay.style.backgroundSize = '';
            initialBookCoverDisplay.style.backgroundPosition = '';
        }
        
        // Reset file input
        if (initialBookCoverInput) {
            initialBookCoverInput.value = '';
        }
    }

    function createBookElement(title, rating, description, coverImageURL) {
        // Create the book container
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-entry';
        bookDiv.setAttribute('data-title', title);
        bookDiv.setAttribute('data-description', description);
        bookDiv.setAttribute('data-rating', rating);

        // Create cover
        const coverDiv = document.createElement('div');
        coverDiv.className = 'book-cover-final';
        
        if (coverImageURL) {
            coverDiv.style.backgroundImage = `url('${coverImageURL}')`;
            coverDiv.style.backgroundSize = 'cover';
            coverDiv.style.backgroundPosition = 'center';
        } else {
            // Use first 2 letters of title
            const coverText = title.substring(0, 2).toUpperCase();
            coverDiv.textContent = coverText;
            coverDiv.style.backgroundColor = '#6d4c41';
            coverDiv.style.color = 'white';
            coverDiv.style.display = 'flex';
            coverDiv.style.justifyContent = 'center';
            coverDiv.style.alignItems = 'center';
            coverDiv.style.fontSize = '1.5em';
            coverDiv.style.fontWeight = 'bold';
        }

        // Create title
        const titlePara = document.createElement('p');
        titlePara.className = 'book-title-display';
        titlePara.textContent = title;

        // Create rating
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'book-rating-display';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = i <= rating ? 'book-star selected' : 'book-star';
            star.textContent = '★';
            ratingDiv.appendChild(star);
        }

        // Assemble the book
        bookDiv.appendChild(coverDiv);
        bookDiv.appendChild(titlePara);
        bookDiv.appendChild(ratingDiv);

        return bookDiv;
    }

    function updateBookPosition(shelf) {
        // Update position for the + button
        const books = shelf.querySelectorAll('.book-entry');
        const addBtn = shelf.querySelector('.add-button');
        
        if (books.length > 0 && addBtn) {
            const lastBook = books[books.length - 1];
            const lastBookRect = lastBook.getBoundingClientRect();
            addBtn.style.left = (lastBookRect.left + lastBookRect.width + 20) + 'px';
        }
    }

    function showBookDetails(title, description, rating, coverImageURL) {
        // Create modal if it doesn't exist
        let detailsModal = document.getElementById('bookDetailsModal');
        
        if (!detailsModal) {
            detailsModal = document.createElement('div');
            detailsModal.id = 'bookDetailsModal';
            detailsModal.className = 'modal';
            detailsModal.innerHTML = `
                <div class="modal-content">
                    <span class="close-button" id="closeDetails">&times;</span>
                    <h2>Book Details</h2>
                    <div class="book-details-container">
                        <div id="detailsBookCover" class="book-details-cover"></div>
                        <div class="book-details-info">
                            <h3 id="detailsTitle"></h3>
                            <div class="details-rating" id="detailsRating"></div>
                            <h4>Description:</h4>
                            <p id="detailsDescription"></p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(detailsModal);

            // Add close functionality
            document.getElementById('closeDetails').addEventListener('click', function() {
                detailsModal.style.display = 'none';
            });

            detailsModal.addEventListener('click', function(event) {
                if (event.target === detailsModal) {
                    detailsModal.style.display = 'none';
                }
            });
        }

        // Populate modal
        document.getElementById('detailsTitle').textContent = title;
        document.getElementById('detailsDescription').textContent = description || 'No description provided.';

        const detailsCover = document.getElementById('detailsBookCover');
        if (coverImageURL) {
            detailsCover.style.backgroundImage = `url('${coverImageURL}')`;
            detailsCover.textContent = '';
            detailsCover.style.backgroundSize = 'cover';
            detailsCover.style.backgroundPosition = 'center';
        } else {
            detailsCover.style.backgroundImage = '';
            detailsCover.textContent = title.substring(0, 2).toUpperCase();
            detailsCover.style.backgroundColor = '#6d4c41';
            detailsCover.style.color = 'white';
            detailsCover.style.display = 'flex';
            detailsCover.style.justifyContent = 'center';
            detailsCover.style.alignItems = 'center';
            detailsCover.style.fontSize = '2em';
        }

        // Create rating stars
        const detailsRating = document.getElementById('detailsRating');
        detailsRating.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.style.color = i <= rating ? 'gold' : '#ccc';
            star.style.fontSize = '24px';
            star.style.marginRight = '2px';
            detailsRating.appendChild(star);
        }

        // Show modal
        detailsModal.style.display = 'block';
    }
});