import transporter from '../config/mailer.config.js';
import ENVIRONMENT from '../config/environment.config.js';

class MailService {
    async sendVerificationEmail(email, nombre, verificationUrl) {
        try {
            const mailOptions = {
                from: ENVIRONMENT.GMAIL_USERNAME,
                to: email,
                subject: '🚀 Verifica tu cuenta en el Hub de Onboarding',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                        <h2>¡Hola ${nombre}! Bienvenido/a a la empresa.</h2>
                        <p>Para activar tu cuenta y acceder a tus cursos de inducción, haz clic en el enlace:</p>
                        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #0056b3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar mi cuenta</a>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`🟢 Correo de verificación enviado a: ${email}`);

        } catch (error) {
            console.error('🔴 Error crítico al enviar el correo:', error);
        }
    }

    async sendResetPasswordEmail(email, resetUrl) {
        // Para cuando implementemos el forgot password
    }
}

export default new MailService();