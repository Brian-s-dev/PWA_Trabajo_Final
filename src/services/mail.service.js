import mailer_transport from '../config/mailer.config.js';
import ENVIRONMENT from '../config/environment.config.js';

class MailService {
    async sendVerificationEmail(email, nombre, token) {
        try {
            const verificationLink = `http://localhost:${ENVIRONMENT.PORT}/api/auth/verify-email?token=${token}`;

            const mailOptions = {
                from: ENVIRONMENT.GMAIL_USERNAME,
                to: email,
                subject: '🚀 Verifica tu cuenta en el Hub de Onboarding',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                        <h2>¡Hola ${nombre}! Bienvenido/a a la empresa.</h2>
                        <p>Para activar tu cuenta y acceder a tus cursos de inducción, haz clic en el botón de abajo:</p>
                        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #0056b3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar mi cuenta</a>
                        <p style="font-size: 12px; color: #777;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                        <p style="font-size: 12px; color: #555;">${verificationLink}</p>
                    </div>
                `
            };

            await mailer_transport.sendMail(mailOptions);
            console.log(`🟢 Correo de verificación enviado exitosamente a: ${email}`);

        } catch (error) {
            console.error('🔴 Error crítico al enviar el correo:', error);
        }
    }
}

export default new MailService();