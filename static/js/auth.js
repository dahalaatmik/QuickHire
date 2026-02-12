document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();

    const switchToRegisterBtn = document.getElementById('switch-to-register');
    const switchToLoginBtn = document.getElementById('switch-to-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (switchToRegisterBtn && loginForm && registerForm) {
        switchToRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });
    }

    if (switchToLoginBtn && registerForm && loginForm) {
        switchToLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });
    }

    const loginFormElement = document.getElementById('login-form-element');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const loginBtn = document.getElementById('login-btn');
            const loginText = document.getElementById('login-text');
            const loginSpinner = document.getElementById('login-spinner');

            loginText.style.display = 'none';
            loginSpinner.style.display = 'inline-block';
            loginBtn.disabled = true;

            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 1500);
        });
    }

    const registerFormElement = document.getElementById('register-form-element');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 1000);
        });
    }
});
