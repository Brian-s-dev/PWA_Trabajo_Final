import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import { createRequire } from 'module';
<<<<<<< HEAD
=======
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
import ENVIRONMENT from '../config/environment.config.js';
import ServerError from '../helpers/serverError.helper.js';
import courseService from '../services/course.service.js';
import moduleService from '../services/module.service.js';

<<<<<<< HEAD
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Controller de la ia para la creacion de cursos.
=======
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
class AiController {
    constructor() {
        this.genAI = new GoogleGenerativeAI(ENVIRONMENT.GEMINI_API_KEY);
    }

    async generateCourseFromPdf(request, response, next) {
        let pdfPath = null;
        try {
            if (!request.file) {
                throw new ServerError('No se ha proporcionado ningún archivo PDF', 400);
            }

            pdfPath = request.file.path;
            const dataBuffer = fs.readFileSync(pdfPath);

            const pdfData = await pdfParse(dataBuffer);
            const textContent = pdfData.text;

            if (!textContent || textContent.trim().length === 0) {
                throw new ServerError('No se pudo extraer texto del PDF o está vacío', 400);
            }

            const prompt = `
            Eres un experto creador de contenido e-learning. Tu tarea es analizar el siguiente texto extraído de un documento corporativo y generar un curso estructurado con módulos.
            
            Debes devolver ÚNICAMENTE un objeto JSON con la siguiente estructura exacta, sin texto adicional, sin formato markdown (\`\`\`json) alrededor:
            {
              "titulo": "Título sugerido para el curso (máx 60 caracteres)",
              "descripcion": "Descripción general del curso",
              "duracion_estimada": 120, // en minutos (número entero)
              "modulos": [
                {
                  "titulo": "Título del módulo 1",
                  "descripcion": "Descripción del módulo",
                  "contenido": "Contenido detallado y educativo para este módulo basado en el documento. Debe ser lo suficientemente largo y explicativo para enseñar el tema."
                }
              ]
            }

            Asegúrate de dividir lógicamente la información en varios módulos (al menos 2 o 3, si el texto lo permite).
            
            TEXTO DEL DOCUMENTO:
            """
<<<<<<< HEAD
            ${textContent.substring(0, 30000)} // Limitador por las dudas.
=======
            ${textContent.substring(0, 30000)} // Limitamos un poco para no exceder tokens por las dudas, aunque Gemini soporta mucho más
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
            """
            `;

            const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            let courseJson;
            try {
<<<<<<< HEAD
=======
                // Limpiar posibles backticks de markdown que a veces Gemini incluye
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
                const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                courseJson = JSON.parse(cleanJson);
            } catch (jsonErr) {
                console.error("Error parseando JSON de Gemini:", responseText);
                throw new ServerError('Error al procesar la respuesta de la IA. Por favor, intenta de nuevo.', 500);
            }

<<<<<<< HEAD
=======
            // Eliminar el archivo PDF temporal
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
            fs.unlinkSync(pdfPath);

            response.status(200).json({
                ok: true,
                message: 'Curso estructurado exitosamente por IA',
                data: courseJson
            });

        } catch (error) {
<<<<<<< HEAD
=======
            // Limpieza en caso de error
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
            if (pdfPath && fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }
            next(error);
        }
    }
}

export default new AiController();
