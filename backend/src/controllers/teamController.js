const Team = require('../models/team');

/**
 * GET /teams
 */
exports.listTeams = (req, res) => {
  Team.find()
    .then(teams => res.json(teams))
    .catch(err => res.status(500).send(err));
};

/**
 * GET /teams/:id
 */
exports.readTeam = (req, res) => {
  Team.findOne({ teamId: parseInt(req.params.id) })
    .then(team => {
      if (!team) {
        return res.status(404).send('Team not found');
      }
      res.json(team);
    })
    .catch(err => res.status(500).send(err));
};