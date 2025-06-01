document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const phoneInput = document.getElementById('phoneNumber');
    const otpSection = document.getElementById('otpSection');
    const otpInput = document.getElementById('otp');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const messageDiv = document.getElementById('message');

    // API endpoints
    const API_URL = 'http://localhost:3000';

    // Show message helper
    function showMessage(text, isError = false) {
        console.log('Showing message:', text, isError ? '(error)' : '(success)');
        messageDiv.textContent = text;
        messageDiv.className = `message ${isError ? 'error' : 'success'}`;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }

    // Phone number validation
    function validatePhoneNumber(phone) {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }

    // Handle send OTP
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phoneNumber = phoneInput.value.trim();
        console.log('Attempting to send OTP to:', phoneNumber);

        if (!validatePhoneNumber(phoneNumber)) {
            console.log('Invalid phone number format');
            showMessage('Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)', true);
            return;
        }

        try {
            console.log('Sending request to:', `${API_URL}/send-otp`);
            sendOtpBtn.disabled = true;
            sendOtpBtn.textContent = 'Sending...';

            const response = await fetch(`${API_URL}/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                showMessage('OTP sent successfully!');
                otpSection.style.display = 'block';
                otpInput.focus();
            } else {
                showMessage(data.message || 'Failed to send OTP', true);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            showMessage('Error connecting to server', true);
        } finally {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';
        }
    });

    // Handle verify OTP
    verifyOtpBtn.addEventListener('click', async () => {
        const phoneNumber = phoneInput.value.trim();
        const otp = otpInput.value.trim();
        console.log('Attempting to verify OTP for:', phoneNumber);

        if (!otp || otp.length !== 6) {
            console.log('Invalid OTP format');
            showMessage('Please enter a valid 6-digit OTP', true);
            return;
        }

        try {
            console.log('Sending verification request to:', `${API_URL}/verify-otp`);
            verifyOtpBtn.disabled = true;
            verifyOtpBtn.textContent = 'Verifying...';

            const response = await fetch(`${API_URL}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, otp }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                showMessage('OTP verified successfully!');
                // Here you can redirect to dashboard or home page
                // window.location.href = '/dashboard';
            } else {
                showMessage(data.message || 'Invalid OTP', true);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            showMessage('Error connecting to server', true);
        } finally {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.textContent = 'Verify OTP';
        }
    });
}); 