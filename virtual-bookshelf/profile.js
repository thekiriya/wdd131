document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const bioDisplay = document.getElementById('bioDisplay');
    const usernameInput = document.getElementById('usernameInput');
    const bioInput = document.getElementById('bioInput');
    const saveButtons = document.querySelectorAll('.save-btn');
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    
    // Load saved data from localStorage
    loadSavedData();
    
    // Profile image upload
    profileImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImageDisplay.style.backgroundImage = `url('${e.target.result}')`;
                profileImageDisplay.textContent = '';
                // Save to localStorage
                localStorage.setItem('profileImage', e.target.result);
                showSuccessMessage('Profile image updated!');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Make display text clickable to edit
    usernameDisplay.addEventListener('click', function() {
        showEditableField('username');
    });
    
    bioDisplay.addEventListener('click', function() {
        showEditableField('bio');
    });
    
    // Save button click handlers
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            saveField(field);
        });
    });
    
    // Also allow saving with Enter key for username
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveField('username');
        }
    });
    
    // Allow Ctrl+Enter to save bio
    bioInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            saveField('bio');
        }
    });
    
    // Functions
    function showEditableField(field) {
        // Hide all display texts
        document.querySelectorAll('.display-text').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show all editable fields
        document.querySelectorAll('.editable-field').forEach(el => {
            el.style.display = 'block';
        });
        
        // Focus on the correct field
        if (field === 'username') {
            usernameInput.focus();
            usernameInput.select();
        } else if (field === 'bio') {
            bioInput.focus();
        }
    }
    
    function saveField(field) {
        let newValue, displayElement, inputElement;
        
        if (field === 'username') {
            newValue = usernameInput.value.trim();
            displayElement = usernameDisplay;
            inputElement = usernameInput;
            
            if (!newValue) {
                alert('Username cannot be empty!');
                return;
            }
        } else if (field === 'bio') {
            newValue = bioInput.value.trim();
            displayElement = bioDisplay;
            inputElement = bioInput;
        }
        
        // Update display text
        displayElement.textContent = newValue || getDefaultText(field);
        
        // Save to localStorage
        localStorage.setItem(field, newValue);
        
        // Show editable field and hide input
        displayElement.style.display = 'block';
        document.querySelectorAll('.editable-field').forEach(el => {
            el.style.display = 'none';
        });
        
        showSuccessMessage(field === 'username' ? 'Username saved!' : 'Bio saved!');
    }
    
    function getDefaultText(field) {
        if (field === 'username') {
            return 'BookLover123';
        } else if (field === 'bio') {
            return 'Welcome to my digital bookcase! I enjoy fantasy novels, historical fiction, and science fiction. I am currently reading All Tomorrows by C.M. Kösemen. My favorite authors are Neil Gaiman and R.F Kuang. I am always looking for new recommendations!';
        }
        return '';
    }
    
    function loadSavedData() {
        // Load username
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            usernameDisplay.textContent = savedUsername;
            usernameInput.value = savedUsername;
        }
        
        // Load bio
        const savedBio = localStorage.getItem('bio');
        if (savedBio) {
            bioDisplay.textContent = savedBio;
            bioInput.value = savedBio;
        }
        
        // Load profile image
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            profileImageDisplay.style.backgroundImage = `url('${savedImage}')`;
            profileImageDisplay.textContent = '';
        }
    }
    
    function showSuccessMessage(message) {
        // Create or get success message element
        let successMsg = document.querySelector('.success-message');
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            document.querySelector('.profile-card').appendChild(successMsg);
        }
        
        successMsg.textContent = message;
        successMsg.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
    }
});