# Flujos de Usuarios (Rutas y Controladores)

Basado en la estructura de rutas (`src/routes/`) y los middlewares de roles implementados en el backend, se identifican los siguientes flujos principales de usuarios en el sistema.

## 1. Flujo de Autenticación (`/api/auth`)
*Rutas públicas para gestionar el acceso y la identidad en la plataforma.*

- `POST /register`: Permite a un nuevo usuario registrarse ingresando sus datos. Pasa por validaciones de formato de entrada.
- `GET /verify-email`: Endpoint para verificar la cuenta de correo del usuario, típicamente accediendo a través de un enlace con token enviado por correo electrónico (*Nodemailer*).
- `POST /login`: Autentica al usuario en la plataforma. Al ser exitoso, devuelve las credenciales de sesión (un token JWT) para ser utilizado en el resto de los flujos.

## 2. Flujo de Gestión de Cursos (`/api/courses`)
*Flujo protegido (requiere autenticación). Administra el catálogo global de cursos de capacitación.*

- `GET /`: Lista todos los cursos disponibles en la plataforma.
- `POST /`: Permite la creación de un nuevo curso.
- `GET /:id`: Obtiene el detalle de un curso en específico (valida previamente mediante middleware que el ID del curso exista en la base de datos).
- `PUT /:id`: Edita la información general de un curso existente.
- `DELETE /:id`: Elimina (o desactiva de manera lógica) un curso.

## 3. Flujo de Gestión de Módulos (`/api/courses/:course_id/modules`)
*Rutas anidadas dentro del flujo de cursos. Maneja el contenido educativo de cada curso.*

- `GET /`: Lista todos los módulos pertenecientes a un curso específico.
- `POST /`: Añade un nuevo módulo o lección a un curso existente.
- `PUT /:module_id`: Actualiza el título y contenido de un módulo en particular.
- `DELETE /:module_id`: Elimina un módulo del curso.

## 4. Flujo de Inscripciones y Progreso (`/api/enrollments`)
*Requiere autenticación y distingue permisos estrictamente según el rol (`ADMIN` o `EMPLOYEE`). Es el flujo central para el aprendizaje.*

### Para Empleados (`EMPLOYEE` y `ADMIN`)
- `GET /my_courses`: Los usuarios pueden ver su propio panel con los cursos a los que están inscritos, incluyendo su estado actual (Pendiente, En progreso, Completado) y su avance.
- `PUT /:course_id/progress`: Permite a los usuarios marcar un módulo como completado. Esta acción actualiza su lista de `modulosCompletados` en su registro de inscripción e impacta automáticamente su estado si finalizaron todos los módulos.

### Exclusivo para Administradores (`ADMIN`)
- `GET /employee/:employee_id`: Permite a un administrador consultar el estado y avance detallado de los cursos asignados a un empleado específico.
- `POST /assign_course`: Permite a un administrador inscribir o asignar un curso del catálogo a un empleado en particular.
