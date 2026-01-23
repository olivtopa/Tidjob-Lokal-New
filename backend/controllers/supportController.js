
// @desc    Send a support message
// @route   POST /api/support/contact
// @access  Public
const nodemailer = require('nodemailer');

// @desc    Send a support message
// @route   POST /api/support/contact
// @access  Public
const sendSupportMessage = async (req, res) => {
    try {
        const { message, email, name } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Le message est requis.' });
        }

        // Configure transporter for OVH SMTP
        const transporter = nodemailer.createTransport({
            host: 'ssl0.ovh.net', // Serveur SMTP OVH standard
            port: 465, // Port sécurisé SSL
            secure: true, // true pour 465, false pour les autres ports
            auth: {
                user: process.env.EMAIL_USER, // Votre adresse email complète OVH (ex: contact@tidjob.com)
                pass: process.env.EMAIL_PASS  // Le mot de passe de cette adresse email
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // L'email doit partir de votre compte authentifié OVH
            to: 'contact@tidjob.com', // Adresse de réception
            replyTo: email, // Permet de répondre directement à l'utilisateur
            subject: `[Tidjob Support] Message de ${name || 'Anonyme'}`,
            text: `
                Nouveau message reçu depuis le Centre d'Aide :
                
                Nom : ${name || 'Non renseigné'}
                Email utilisateur : ${email || 'Non renseigné'}
                
                --- Message ---
                ${message}
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email de support envoyé de ${email} à contact@tidjob.com`);

        res.status(200).json({ message: 'Message envoyé avec succès.' });
    } catch (error) {
        console.error('Support email error:', error);
        // Fallback or specific error handling
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email (vérifiez la configuration SMTP).' });
    }
};

module.exports = {
    sendSupportMessage
};
