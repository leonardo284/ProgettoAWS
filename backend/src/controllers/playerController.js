const Player = require('../models/player');

exports.listPlayers = (req, res) => {
    Player.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}

exports.readPlayer = (req, res) => {
    Player.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Player not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createPlayer = (req, res) => {
    const player = new Player(req.body);
    player.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updatePlayer = (req, res) => {
    Player.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Player not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deletePlayer = (req, res) => {
    Player.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Player not found');
            }
            res.json({ message: 'Player deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

