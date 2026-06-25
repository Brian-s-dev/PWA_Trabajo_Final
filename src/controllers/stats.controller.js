import User from '../models/user.model.js';
import Enrollment from '../models/enrollment.model.js';
import Course from '../models/course.model.js';
import { ROLES } from '../constants/roles.constant.js';
import { ENROLLMENT_STATUS } from '../constants/enrollmentStatus.constant.js';

class StatsController {
    async getAdminStats(req, res, next) {
        try {
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

            const criticalCourses = await Enrollment.aggregate([
                { $match: { activo: true } },
                {
                    $group: {
                        _id: '$curso',
                        totalEnrollments: { $sum: 1 },
                        completed: { $sum: { $cond: [{ $eq: ['$estado', ENROLLMENT_STATUS.COMPLETADO] }, 1, 0] } }
                    }
                },
                { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'cursoInfo' } },
                { $unwind: '$cursoInfo' },
                {
                    $project: {
                        _id: 1,
                        titulo: '$cursoInfo.titulo',
                        totalEnrollments: 1,
                        completionRate: {
                            $cond: [
                                { $eq: ['$totalEnrollments', 0] },
                                0,
                                { $round: [{ $multiply: [{ $divide: ['$completed', '$totalEnrollments'] }, 100] }, 1] }
                            ]
                        }
                    }
                },
                { $sort: { totalEnrollments: -1 } },
                { $limit: 5 }
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
                    criticalCourses,
                    recentEmployees
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StatsController();
