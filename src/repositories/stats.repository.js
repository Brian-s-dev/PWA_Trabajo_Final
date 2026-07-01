import User from '../models/user.model.js';
import Enrollment from '../models/enrollment.model.js';
import EnrollmentModule from '../models/enrollmentModule.model.js';
import { ROLES } from '../constants/roles.constant.js';
import { ENROLLMENT_STATUS } from '../constants/enrollmentStatus.constant.js';
import { MODULE_STATUS } from '../constants/moduleStatus.constant.js';
import mongoose from 'mongoose';

class StatsRepository {
    async countActiveEmployees() {
        return await User.countDocuments({ rol: ROLES.EMPLOYEE, activo: true });
    }

    async getEnrollmentStatusCounts() {
        return await Enrollment.aggregate([
            { $match: { activo: true } },
            { $group: { _id: '$estado', count: { $sum: 1 } } }
        ]);
    }

    async getCourseCompletionStats() {
        return await Enrollment.aggregate([
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
                            { $divide: ['$completionTimeSum', '$completed'] }
                        ]
                    }
                }
            }
        ]);
    }

    async getRecentEmployees(limit = 5) {
        return await User.find({ rol: ROLES.EMPLOYEE })
            .select('nombre email email_verificado createdAt avatar')
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async getActiveEnrollmentsByCourse(courseId) {
        const courseObjectId = new mongoose.Types.ObjectId(courseId);
        return await Enrollment.find({ curso: courseObjectId, activo: true });
    }

    async getDropoffStats(inProgressEnrollmentIds) {
        return await EnrollmentModule.aggregate([
            { $match: { enrollment: { $in: inProgressEnrollmentIds } } },
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: '$enrollment',
                    lastCompletedModule: {
                        $last: {
                            $cond: [{ $eq: ['$estado', MODULE_STATUS.COMPLETADO] }, '$modulo', null]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$lastCompletedModule',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'modules',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'moduleInfo'
                }
            },
            {
                $project: {
                    _id: 1,
                    titulo: { $ifNull: [{ $arrayElemAt: ['$moduleInfo.titulo', 0] }, 'Sin empezar'] },
                    count: 1
                }
            }
        ]);
    }

    async getEngagementStats(enrollmentIds) {
        return await EnrollmentModule.aggregate([
            { $match: { enrollment: { $in: enrollmentIds }, estado: MODULE_STATUS.COMPLETADO, fechaCompletado: { $ne: null } } },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: '$fechaCompletado' }
                }
            },
            {
                $group: {
                    _id: '$dayOfWeek',
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async getActiveEnrollmentsByUser(userId) {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        return await Enrollment.find({ empleado: userObjectId, activo: true }).populate('curso', 'titulo');
    }

    async getModulesByEnrollments(enrollmentIds) {
        return await EnrollmentModule.find({ enrollment: { $in: enrollmentIds } })
            .populate('modulo', 'titulo')
            .populate({ path: 'enrollment', populate: { path: 'curso', select: 'titulo' } });
    }
}

export default new StatsRepository();
