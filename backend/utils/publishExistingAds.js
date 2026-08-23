/**
 * Script to publish existing services and service requests to Facebook Page via Make Webhook.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../models');
const { publishToFacebook } = require('./facebookPublisher');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function publishExistingAds() {
  try {
    console.log('🔄 Connexion à la base de données PostgreSQL...');
    await db.sequelize.authenticate();
    console.log('✅ Base de données connectée !');

    // Fetch latest Services (Offres de prestations)
    const services = await db.Service.findAll({
      include: [{ association: 'provider', attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Fetch latest ServiceRequests (Demandes de service)
    const serviceRequests = await db.ServiceRequest.findAll({
      include: [{ association: 'client', attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    console.log(`📋 Trouvé : ${services.length} offres de prestations et ${serviceRequests.length} demandes de service.`);

    let count = 0;

    // Publish Services
    for (const service of services) {
      count++;
      console.log(`\n[${count}] 📢 Publication de l'offre : "${service.title}"`);
      await publishToFacebook({
        type: 'service',
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        zipCode: service.zipCode,
        city: service.city,
        department: service.department,
        id: service.id,
        userName: service.provider ? service.provider.name : null
      });
      // Pause of 3 seconds between posts to prevent spam detection
      await sleep(3000);
    }

    // Publish Service Requests
    for (const req of serviceRequests) {
      count++;
      console.log(`\n[${count}] 🆘 Publication de la demande : "${req.title}"`);
      await publishToFacebook({
        type: 'request',
        title: req.title,
        description: req.description,
        category: req.category,
        budget: req.budget,
        zipCode: req.zipCode,
        city: req.city,
        department: req.department,
        id: req.id,
        userName: req.client ? req.client.name : null
      });
      await sleep(3000);
    }

    console.log(`\n🎉 TERMINÉ ! Total de ${count} annonces publiées sur Facebook !`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur lors de la publication des annonces existantes :', error);
    process.exit(1);
  }
}

publishExistingAds();
