
require('dotenv').config();
const mongoose = require('mongoose');
const Formation = require('./models/Formation');

const formationsData = [
  {
    title: 'Introduction à React',
    description: 'Apprenez les bases de React, la bibliothèque JavaScript la plus populaire pour construire des interfaces utilisateur.',
    chapters: [
      { title: 'Qu\'est-ce que React ?', content: 'Contenu du chapitre 1...', order: 1 },
      { title: 'Composants et Props', content: 'Contenu du chapitre 2...', order: 2 },
      { title: 'État et Cycle de Vie', content: 'Contenu du chapitre 3...', order: 3 },
    ],
  },
  {
    title: 'Node.js pour les débutants',
    description: 'Construisez des applications serveur rapides et scalables avec Node.js.',
    chapters: [
      { title: 'Introduction à Node.js', content: 'Contenu du chapitre 1...', order: 1 },
      { title: 'Modules et npm', content: 'Contenu du chapitre 2...', order: 2 },
      { title: 'Serveur HTTP simple', content: 'Contenu du chapitre 3...', order: 3 },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à MongoDB pour le seeding...');

    await Formation.deleteMany({});
    console.log('Anciennes formations supprimées.');

    await Formation.insertMany(formationsData);
    console.log('Formations ajoutées avec succès.');

  } catch (err) {
    console.error('Erreur de seeding:', err);
  } finally {
    mongoose.connection.close();
    console.log('Déconnecté de MongoDB.');
  }
};

seedDB();
