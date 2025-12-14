document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const bioDisplay = document.getElementById('bioDisplay');
    const usernameInput = document.getElementById('usernameInput');
    const bioInput = document.getElementById('bioInput');
    const usernameSaveBtn = document.querySelector('.save-btn[data-field="username"]');
    const bioSaveBtn = document.querySelector('.save-btn[data-field="bio"]');
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
                showSuccessMessage('Profile image updated!', 'profile');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Username click to edit
    usernameDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        // Show username edit field, hide bio edit field
        usernameDisplay.style.display = 'none';
        usernameInput.closest('.editable-field').style.display = 'block';
        
        // Make sure bio is in display mode
        bioDisplay.style.display = 'flex';
        bioInput.closest('.editable-field').style.display = 'none';
        
        // Focus on username input
        usernameInput.focus();
        usernameInput.select();
    });
    
    // Bio click to edit
    bioDisplay.addEventListener('click', function(e) {
        e.stopPropagation();
        // Show bio edit field, hide username edit field
        bioDisplay.style.display = 'none';
        bioInput.closest('.editable-field').style.display = 'block';
        
        // Make sure username is in display mode
        usernameDisplay.style.display = 'flex';
        usernameInput.closest('.editable-field').style.display = 'none';
        
        // Focus on bio input
        bioInput.focus();
    });
    
    // Username save button
    usernameSaveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        saveUsername();
    });
    
    // Bio save button
    bioSaveBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        saveBio();
    });
    
    // Save username with Enter key
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveUsername();
        }
    });
    
    // Save bio with Ctrl+Enter
    bioInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            saveBio();
        }
    });
    
    // Close edit mode if clicking outside
    document.addEventListener('click', function(e) {
        // If clicking outside of any editable area
        if (!e.target.closest('.editable-field') && 
            !e.target.classList.contains('display-text') &&
            e.target !== usernameSaveBtn && 
            e.target !== bioSaveBtn) {
            
            // Check if we're editing username
            const usernameField = usernameInput.closest('.editable-field');
            if (usernameField.style.display === 'block' || usernameField.style.display === '') {
                // Cancel username editing
                usernameDisplay.style.display = 'flex';
                usernameField.style.display = 'none';
                // Restore original value
                usernameInput.value = usernameDisplay.textContent;
            }
            
            // Check if we're editing bio
            const bioField = bioInput.closest('.editable-field');
            if (bioField.style.display === 'block' || bioField.style.display === '') {
                // Cancel bio editing
                bioDisplay.style.display = 'flex';
                bioField.style.display = 'none';
                // Restore original value
                bioInput.value = bioDisplay.textContent;
            }
        }
    });
    
    // Functions
    function saveUsername() {
        const newValue = usernameInput.value.trim();
        
        if (!newValue) {
            alert('Username cannot be empty!');
            usernameInput.focus();
            return;
        }
        
        // Update display
        usernameDisplay.textContent = newValue;
        
        // Switch back to display mode
        usernameDisplay.style.display = 'flex';
        usernameInput.closest('.editable-field').style.display = 'none';
        
        // Save to localStorage
        localStorage.setItem('username', newValue);
        
        showSuccessMessage('Username saved!', 'username');
    }
    
    function saveBio() {
        const newValue = bioInput.value.trim();
        
        // Update display (or use default if empty)
        bioDisplay.textContent = newValue || getDefaultBio();
        
        // Switch back to display mode
        bioDisplay.style.display = 'flex';
        bioInput.closest('.editable-field').style.display = 'none';
        
        // Save to localStorage
        localStorage.setItem('bio', newValue);
        
        showSuccessMessage('Bio saved!', 'bio');
    }
    
    function getDefaultBio() {
        return 'Welcome to my digital bookcase! I enjoy fantasy novels, historical fiction, and science fiction. I am currently reading All Tomorrows by C.M. Kösemen. My favorite authors are Neil Gaiman and R.F Kuang. I am always looking for new recommendations!';
    }
    
    function getDefaultUsername() {
        return 'BookLover123';
    }
    
    function loadSavedData() {
        // Load username
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            usernameDisplay.textContent = savedUsername;
            usernameInput.value = savedUsername;
        } else {
            usernameDisplay.textContent = getDefaultUsername();
            usernameInput.value = getDefaultUsername();
        }
        
        // Load bio
        const savedBio = localStorage.getItem('bio');
        if (savedBio) {
            bioDisplay.textContent = savedBio;
            bioInput.value = savedBio;
        } else {
            bioDisplay.textContent = getDefaultBio();
            bioInput.value = getDefaultBio();
        }
        
        // Load profile image
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            profileImageDisplay.style.backgroundImage = `url('${savedImage}')`;
            profileImageDisplay.textContent = '';
        }
    }
    
    function showSuccessMessage(message, field) {
        // Remove any existing success messages
        document.querySelectorAll('.success-message').forEach(el => el.remove());
        
        // Create new success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        
        // Find the parent profile-detail container for this field
        let container;
        if (field === 'username') {
            container = usernameDisplay.closest('.profile-detail');
        } else if (field === 'bio') {
            container = bioDisplay.closest('.profile-detail');
        } else if (field === 'profile') {
            container = document.querySelector('.profile-image-section');
        }
        
        if (container) {
            container.appendChild(successMsg);
            
            // Show the message
            setTimeout(() => {
                successMsg.classList.add('show');
            }, 10);
            
            // Hide after 3 seconds
            setTimeout(() => {
                successMsg.classList.remove('show');
                setTimeout(() => {
                    if (successMsg.parentNode) {
                        successMsg.parentNode.removeChild(successMsg);
                    }
                }, 300);
            }, 3000);
        }
    }
});