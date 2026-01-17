const User = require('../models/user'); // Importiamo il modello Mongoose
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username e password richiesti" });
    }

    // Cerco l'utente nel database MongoDB
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: "Utente non trovato" });
    }

    // Confronta la password inserita con quella cifrata (hash) nel DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Risposta in caso di successo
      res.json({
        success: true,
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