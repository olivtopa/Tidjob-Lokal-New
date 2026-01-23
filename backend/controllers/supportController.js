
// @desc    Send a support message
// @route   POST /api/support/contact
// @access  Public
const sendSupportMessage = async (req, res) => {
    try {
        const { message, email, name } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Le message est requis.' });
        }

        // In a real application, you would use a service like Nodemailer or SendGrid here.
        // For now, we will log the message to the console.
        console.log('--- NOUVEAU MESSAGE SUPPORT ---');
        console.log(`De: ${name || 'Anonyme'} <${email || 'Pas d\'email fourni'}>`);
        console.log(`Message: ${message}`);
        console.log('-------------------------------');

        // Simulate functionality for "sending to contact@tidjob.com"
        console.log('Simulation: Email sent to contact@tidjob.com');

        res.status(200).json({ message: 'Message envoyé avec succès.' });
    } catch (error) {
        console.error('Support error:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
    }
};

module.exports = {
    sendSupportMessage
};
