import statsService from '../services/stats.service.js';

class StatsController {
    async getAdminStats(request, response, next) {
        try {
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
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StatsController();
