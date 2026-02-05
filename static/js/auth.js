// Authentication Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();
    
    // Setup form switching
    const switchToRegisterBtn = document.getElementById('switch-to-register');
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
    }
    
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }
    
    // Handle login
    const loginFormElement = document.getElementById('login-form-element');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const loginBtn = document.getElementById('login-btn');
            const loginText = document.getElementById('login-text');
            const loginSpinner = document.getElementById('login-spinner');
            
            // Show loading state
            loginText.style.display = 'none';
            loginSpinner.style.display = 'inline-block';
            loginBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
    
    // Handle register
    const registerFormElement = document.getElementById('register-form-element');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate registration then go to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    }
});
