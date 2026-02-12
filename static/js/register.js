document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();

    const registerFormElement = document.getElementById('register-form-element');
    if (!registerFormElement) return;

    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();

        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            alert('Please agree to the Terms of Service and Privacy Policy before creating your account.');
            return;
        }


        function validatePasswords() {
            const passwordField = document.getElementById('password');
            const confirmField = document.getElementById('confirm-password');
            
            const pass = passwordField.value;
            const confirm = confirmField.value;
        
            // Validation Criteria
            const isLengthValid = pass.length > 8; // "More than 8" means 9+
            const hasCapital  = /[A-Z]/.test(pass);
            const hasSmall    = /[a-z]/.test(pass);
            const hasNumber   = /[0-9]/.test(pass);
            const hasSpecial  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass);
        
            // Check if everything is valid AND they match
            if (isLengthValid && hasCapital && hasSmall && hasNumber && hasSpecial && pass === confirm) {
                console.log("Password is valid and matches.");
                return true; 
            } else {
                // If any condition fails, alert and wipe the fields
                alert("Invalid password or mismatch. Requirements: 9+ characters, uppercase, lowercase, number, and special character.");
                
                passwordField.value = "";
                confirmField.value = "";
                passwordField.focus(); // Reset cursor for the user
                
                return false;
            }
        }

        const registerBtn = document.getElementById('register-btn');
        const registerText = document.getElementById('register-text');
        const registerSpinner = document.getElementById('register-spinner');
        if (registerText) registerText.style.display = 'none';
        if (registerSpinner) registerSpinner.style.display = 'inline-block';
        if (registerBtn) { registerBtn.disabled = true; }

        setTimeout(() => {
            window.location.href = '../dashboard/dashboard.html';
        }, 2000);
    });
});
