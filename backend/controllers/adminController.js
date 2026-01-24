const { User, ServiceRequest, Message, Service, LoginLog } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getStatsData = async (req, res) => {
    try {
        // 1. Daily Connections (LoginLog grouped by day)
        // Group by date(loginAt)
        // Note: SQLite syntax for date is different from Postgres/MySQL. Assuming SQLite or standard SQL.
        // For compatibility, we might fetch all and process in JS if dataset is small, or use raw query.
        // Let's use a raw query for aggregation which is often easier than Sequelize for this.
        // SQLite: strftime('%Y-%m-%d', loginAt)
        const dailyConnections = await sequelize.query(
            `SELECT date(loginAt) as date, COUNT(*) as count FROM LoginLogs GROUP BY date(loginAt) ORDER BY date DESC LIMIT 30`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // 2. Top Categories (Services & Requests)
        const servicesByCategory = await Service.findAll({
            attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['category'],
            order: [[sequelize.literal('count'), 'DESC']],
            limit: 5
        });

        const requestsByCategory = await ServiceRequest.findAll({
            attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['category'],
            order: [[sequelize.literal('count'), 'DESC']],
            limit: 5
        });

        // 3. User Performance - Service Providers (Services Offered & Realized)
        // We need to count 'Services' offered by provider
        // And 'ServiceRequests' where providerId is them and status is completed (or just assigned if that's the metric)
        // The user asked for "nombre de prestation réalisée par prestataire".
        const providers = await User.findAll({
            where: { role: 'provider' },
            attributes: ['id', 'name'],
            include: [
                {
                    model: Service,
                    as: 'offeredServices',
                    attributes: ['id']
                },
                {
                    model: ServiceRequest,
                    as: 'performedRequests',
                    attributes: ['id', 'status'],
                    // where: { status: 'completed' } // Optional: filter by completed only? User said "réalisée". Let's stick to assigned/performed for now or just count all linked.
                }
            ]
        });

        const providerStats = providers.map(p => ({
            id: p.id,
            name: p.name,
            offered: p.offeredServices.length,
            realized: p.performedRequests.length // Counts requests assigned to them
        }));

        // 4. User Performance - Clients (Requests Posted & Received)
        // "nombre de service reçu par client" -> Interpreted as requests that were completed/performed for them
        const clients = await User.findAll({
            where: { role: 'client' },
            attributes: ['id', 'name'],
            include: [
                {
                    model: ServiceRequest,
                    as: 'requestedServices',
                    attributes: ['id', 'status', 'providerId']
                }
            ]
        });

        const clientStats = clients.map(c => ({
            id: c.id,
            name: c.name,
            posted: c.requestedServices.length,
            received: c.requestedServices.filter(r => r.providerId !== null).length // Count requests that have a provider assigned
        }));

        // Global Counts
        const totalProviders = await User.count({ where: { role: 'provider' } });
        const totalClients = await User.count({ where: { role: 'client' } });
        const totalServicesPosted = await ServiceRequest.count(); // "Service postés" usually refers to Requests in this context (Client posts request)?
        // Wait, "Service postés" (Requests) vs "Prestation proposées" (Services offered by provider).
        const totalOfferedServices = await Service.count();

        res.json({
            dailyConnections,
            topCategories: {
                services: servicesByCategory,
                requests: requestsByCategory
            },
            providerStats,
            clientStats,
            counts: {
                providers: totalProviders,
                clients: totalClients,
                requestsPosted: totalServicesPosted,
                servicesOffered: totalOfferedServices
            }
        });

    } catch (error) {
        console.error('Error fetching advanced stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const usersCount = await User.count();
        // Assuming all requests are active for now since we don't have a status column yet
        const requestsCount = await ServiceRequest.count();
        const messagesCount = await Message.count();

        res.status(200).json({
            users: usersCount,
            requests: requestsCount,
            messages: messagesCount
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

exports.getRecentActivity = async (req, res) => {
    try {
        // Fetch recent 5 users
        const newUsers = await User.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });

        // Fetch recent 5 requests
        const newRequests = await ServiceRequest.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'title', 'category', 'budget', 'createdAt']
        });

        // Combine and sort (simplified: just returning separate lists for the UI to handle)
        res.status(200).json({
            recentUsers: newUsers,
            recentRequests: newRequests
        });
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ message: 'Error fetching activity' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching all requests:', error);
        res.status(500).json({ message: 'Error fetching requests' });
    }
};
