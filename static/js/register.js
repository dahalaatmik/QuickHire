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

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        const registerBtn = document.getElementById('register-btn');
        const registerText = document.getElementById('register-text');
        const registerSpinner = document.getElementById('register-spinner');

        registerText.style.display = 'none';
        registerSpinner.style.display = 'inline-block';
        registerBtn.disabled = true;

        setTimeout(() => {
            window.location.href = '../dashboard/dashboard.html';
        }, 2000);
    });
});
