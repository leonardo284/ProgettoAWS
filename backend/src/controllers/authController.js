const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// In un progetto reale, questa chiave andrebbe in un file .env
const JWT_SECRET = "f64fe192a6429f0d98b8e2a2d268d563e53ef05d652c6431966b70b4be265979256a76e2b8780a44ae17f1c83d89e949a7a05422ca2d4db3278ef3e7b9edd56a"; 

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username e password richiesti" });
    }

    // cerco l'utente nel database con quello username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: "Utente non trovato" });
    }

    // controllo che la password sia corretta
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // CREAZIONE DEL TOKEN
      // Inserisco nel token l'ID e il ruolo dell'utente
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '2h' } // Il token scadrà dopo 2 ore
      );

      // INVIO DEL TOKEN AL FRONTEND
      res.json({
        success: true,
        token: token, // spedisco il token
        user: {
          id: user._id, 
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Password errata" });
    }
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ success: false, message: "Errore interno del server" });
  }
};