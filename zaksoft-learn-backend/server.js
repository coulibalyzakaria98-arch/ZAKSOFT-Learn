require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const formationRoutes = require('./routes/formations');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

// --- Configuration CORS Sécurisée ---
const allowedOrigins = [
  'https://zaksoft-learngit-6619273-c98c7.web.app', // Votre domaine de production
  'http://localhost:3000',                         // Frontend en développement
  // L'origine d'IDX est souvent dynamique, on peut la gérer comme ça :
  process.env.NODE_ENV !== 'production' ? /https:\/\/.*-3000-.*\.idx\.dev/ : null
].filter(Boolean); // Filtre les valeurs null

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (ex: Postman) ou si l'origine est dans la liste blanche
    if (!origin || allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, {
  cors: { ...corsOptions }
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/formations', formationRoutes);
app.use('/api/users', userRoutes);

io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté via Socket.IO');
  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

app.get('/', (req, res) => {
  res.send('Le serveur est en marche');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
