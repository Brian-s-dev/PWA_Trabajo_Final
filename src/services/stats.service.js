import statsRepository from '../repositories/stats.repository.js';
import { ENROLLMENT_STATUS } from '../constants/enrollmentStatus.constant.js';
import { MODULE_STATUS } from '../constants/moduleStatus.constant.js';

class StatsService {
    /**
     * Obtiene estadísticas globales para el dashboard de administrador.
     * @returns {Promise<Object>} Datos de empleados, progreso global y cursos críticos.
     */
    async getAdminStats() {
        const activeEmployees = await statsRepository.countActiveEmployees();
        const enrollmentStats = await statsRepository.getEnrollmentStatusCounts();

        const distribution = {
            [ENROLLMENT_STATUS.PENDIENTE]: 0,
            [ENROLLMENT_STATUS.EN_PROGRESO]: 0,
            [ENROLLMENT_STATUS.COMPLETADO]: 0
        };

        let totalEnrollments = 0;
        enrollmentStats.forEach(stat => {
            distribution[stat._id] = stat.count;
            totalEnrollments += stat.count;
        });

        const globalCompletionRate = totalEnrollments === 0
            ? 0
            : Math.round((distribution[ENROLLMENT_STATUS.COMPLETADO] / totalEnrollments) * 100);

        const courseStats = await statsRepository.getCourseCompletionStats();
        const recentEmployees = await statsRepository.getRecentEmployees(5);

        return {
            activeEmployees,
            globalCompletionRate,
            inProgress: distribution[ENROLLMENT_STATUS.EN_PROGRESO],
            distribution,
            criticalCourses: courseStats,
            recentEmployees
        };
    }

    /**
     * Obtiene analíticas específicas de un curso.
     * @param {string} courseId - ID del curso.
     * @returns {Promise<Object>} Distribución, abandonos y engagement.
     */
    async getCourseAnalytics(courseId) {
        const enrollments = await statsRepository.getActiveEnrollmentsByCourse(courseId);

        const distribution = {
            [ENROLLMENT_STATUS.PENDIENTE]: 0,
            [ENROLLMENT_STATUS.EN_PROGRESO]: 0,
            [ENROLLMENT_STATUS.COMPLETADO]: 0
        };

        enrollments.forEach(e => {
            distribution[e.estado] = (distribution[e.estado] || 0) + 1;
        });

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const inactiveStudents = enrollments.filter(e =>
            e.estado === ENROLLMENT_STATUS.EN_PROGRESO && e.updatedAt < fourteenDaysAgo
        ).length;

        const inProgressIds = enrollments.filter(e => e.estado === ENROLLMENT_STATUS.EN_PROGRESO).map(e => e._id);

        let dropoffStats = [];
        if (inProgressIds.length > 0) {
            dropoffStats = await statsRepository.getDropoffStats(inProgressIds);
        }

        const enrollmentIds = enrollments.map(e => e._id);

        let engagement = Array.from({ length: 7 }, (_, i) => ({
            day: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][i],
            count: 0
        }));

        if (enrollmentIds.length > 0) {
            const engagementStats = await statsRepository.getEngagementStats(enrollmentIds);
            const daysMap = { 1: 'Domingo', 2: 'Lunes', 3: 'Martes', 4: 'Miércoles', 5: 'Jueves', 6: 'Viernes', 7: 'Sábado' };

            engagement = Array.from({ length: 7 }, (_, i) => ({
                day: daysMap[i + 1],
                count: engagementStats.find(s => s._id === i + 1)?.count || 0
            }));
        }

        return {
            distribution,
            inactiveStudents,
            dropoffStats,
            engagement
        };
    }

    /**
     * Obtiene analíticas de progreso de un usuario específico.
     * @param {string} userId - ID del usuario.
     * @returns {Promise<Object>} Promedio de avance, cursos estancados, actividad y timeline.
     */
    async getUserAnalytics(userId) {
        const enrollments = await statsRepository.getActiveEnrollmentsByUser(userId);
        const enrollmentIds = enrollments.map(e => e._id);

        let modules = [];
        if (enrollmentIds.length > 0) {
            modules = await statsRepository.getModulesByEnrollments(enrollmentIds);
        }

        let totalProgress = 0;
        enrollments.forEach(enrollment => {
            const courseModules = modules.filter(m => m.enrollment._id.toString() === enrollment._id.toString());
            const completed = courseModules.filter(m => m.estado === MODULE_STATUS.COMPLETADO).length;
            if (courseModules.length > 0) {
                totalProgress += (completed / courseModules.length) * 100;
            }
        });
        const avgProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const stalledCourses = enrollments
            .filter(e => e.estado === ENROLLMENT_STATUS.PENDIENTE && e.createdAt < fourteenDaysAgo)
            .map(e => ({
                id: e._id,
                titulo: e.curso ? e.curso.titulo : 'Curso eliminado',
                asignadoEl: e.createdAt
            }));

        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const recentModules = modules.filter(m =>
            m.estado === MODULE_STATUS.COMPLETADO && m.fechaCompletado && m.fechaCompletado >= fourWeeksAgo
        );

        const timeline = [];

        enrollments.forEach(e => {
            const cursoTitulo = e.curso ? e.curso.titulo : 'Curso eliminado';
            timeline.push({
                type: 'enrollment',
                date: e.createdAt,
                title: `Asignado al curso: ${cursoTitulo}`,
                status: 'NUEVO'
            });
            if (e.estado === ENROLLMENT_STATUS.COMPLETADO) {
                timeline.push({
                    type: 'course_completed',
                    date: e.updatedAt,
                    title: `Completó el curso: ${cursoTitulo}`,
                    status: 'COMPLETADO'
                });
            }
        });

        modules.forEach(m => {
            if (m.estado === MODULE_STATUS.COMPLETADO && m.fechaCompletado) {
                timeline.push({
                    type: 'module_completed',
                    date: m.fechaCompletado,
                    title: `Completó el módulo: ${m.modulo?.titulo} (${m.enrollment?.curso?.titulo})`,
                    status: 'COMPLETADO'
                });
            }
        });

        timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentTimeline = timeline.slice(0, 10);

        return {
            avgProgress,
            stalledCourses,
            recentModules: recentModules.length,
            timeline: recentTimeline
        };
    }
}

export default new StatsService();
