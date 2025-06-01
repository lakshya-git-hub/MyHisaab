const express = require('express');
const cors = require('cors');
// Only import twilio if we're in production
let twilioClient = null;
try {
    const twilio = require('twilio');
    // Only initialize if credentials are provided
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }
} catch (error) {
    console.log('Twilio not configured - running in development mode');
}

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for OTPs
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired OTPs
function cleanupExpiredOTPs() {
    const now = Date.now();
    for (const [phone, data] of otpStore.entries()) {
        if (now - data.timestamp > 5 * 60 * 1000) { // 5 minutes
            otpStore.delete(phone);
        }
    }
}

// Run cleanup every minute
setInterval(cleanupExpiredOTPs, 60 * 1000);

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP with timestamp
        otpStore.set(phoneNumber, {
            otp,
            timestamp: Date.now()
        });

        // Send SMS if Twilio is configured
        if (twilioClient) {
            try {
                await twilioClient.messages.create({
                    body: `Your OTP is: ${otp}. Valid for 5 minutes.`,
                    to: phoneNumber,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
            } catch (smsError) {
                console.error('Error sending SMS:', smsError);
                // Continue even if SMS fails - we'll still return success
            }
        } else {
            // In development, log the OTP
            console.log(`[DEV MODE] OTP for ${phoneNumber}: ${otp}`);
        }

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        const storedData = otpStore.get(phoneNumber);

        if (!storedData) {
            return res.status(400).json({ message: 'No OTP found for this phone number' });
        }

        // Check if OTP is expired (5 minutes)
        if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
            otpStore.delete(phoneNumber);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear the OTP after successful verification
        otpStore.delete(phoneNumber);

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Mode:', twilioClient ? 'Production (Twilio enabled)' : 'Development (SMS disabled)');
}); 