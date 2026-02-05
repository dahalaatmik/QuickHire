// Registration Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();
    
    // Handle registration
    const registerFormElement = document.getElementById('register-form-element');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate passwords match
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Validate password length
            if (password.length < 8) {
                alert('Password must be at least 8 characters long!');
                return;
            }
            
            const registerBtn = document.getElementById('register-btn');
            const registerText = document.getElementById('register-text');
            const registerSpinner = document.getElementById('register-spinner');
            
            // Show loading state
            registerText.style.display = 'none';
            registerSpinner.style.display = 'inline-block';
            registerBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = '../dashboard/dashboard.html';
            }, 2000);
        });
    }
});
