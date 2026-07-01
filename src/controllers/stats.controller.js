import statsService from '../services/stats.service.js';

class StatsController {
    async getAdminStats(request, response, next) {
        try {
<<<<<<< HEAD
            const data = await statsService.getAdminStats();
            response.status(200).json({
                ok: true,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async getCourseAnalytics(request, response, next) {
        try {
            const { courseId } = request.params;
            const data = await statsService.getCourseAnalytics(courseId);
            response.status(200).json({
                ok: true,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserAnalytics(request, response, next) {
        try {
            const { userId } = request.params;
            const data = await statsService.getUserAnalytics(userId);
            response.status(200).json({
                ok: true,
                data
=======
            const activeEmployees = await User.countDocuments({ rol: ROLES.EMPLOYEE, activo: true });

            const enrollmentStats = await Enrollment.aggregate([
                { $match: { activo: true } },
                { $group: { _id: '$estado', count: { $sum: 1 } } }
            ]);

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

            const courseStats = await Enrollment.aggregate([
                { $match: { activo: true } },
                {
                    $group: {
                        _id: '$curso',
                        totalEnrollments: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ['$estado', ENROLLMENT_STATUS.COMPLETADO] }, 1, 0] } },
                        inProgress: { $sum: { $cond: [{ $eq: ['$estado', ENROLLMENT_STATUS.EN_PROGRESO] }, 1, 0] } },
                        completionTimeSum: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$estado', ENROLLMENT_STATUS.COMPLETADO] },
                                    { $subtract: ['$updatedAt', '$createdAt'] },
                                    0
                                ]
                            }
                        }
                    }
                },
                { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'cursoInfo' } },
                { $unwind: '$cursoInfo' },
                {
                    $project: {
                        _id: 1,
                        titulo: '$cursoInfo.titulo',
                        totalEnrollments: 1,
                        inProgress: 1,
                        completed: 1,
                        completionRate: {
                            $cond: [
                                { $eq: ['$totalEnrollments', 0] },
                                0,
                                { $round: [{ $multiply: [{ $divide: ['$completed', '$totalEnrollments'] }, 100] }, 1] }
                            ]
                        },
                        abandonmentRate: {
                            $cond: [
                                { $eq: ['$totalEnrollments', 0] },
                                0,
                                { $round: [{ $multiply: [{ $divide: ['$inProgress', '$totalEnrollments'] }, 100] }, 1] }
                            ]
                        },
                        avgCompletionTime: {
                            $cond: [
                                { $eq: ['$completed', 0] },
                                null,
                                { $divide: ['$completionTimeSum', '$completed'] } // en milisegundos
                            ]
                        }
                    }
                }
            ]);

            const recentEmployees = await User.find({ rol: ROLES.EMPLOYEE })
                .select('nombre email email_verificado createdAt avatar')
                .sort({ createdAt: -1 })
                .limit(5);

            res.status(200).json({
                ok: true,
                data: {
                    activeEmployees,
                    globalCompletionRate,
                    inProgress: distribution[ENROLLMENT_STATUS.EN_PROGRESO],
                    distribution,
                    criticalCourses: courseStats,
                    recentEmployees
                }
>>>>>>> 77c3bf858dea030fe6c71294123b92721bdfba16
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StatsController();
