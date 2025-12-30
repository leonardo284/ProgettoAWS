const Team = require('../models/team');

/**
 * GET /teams
 * Ritorna tutti i team
 */
exports.listTeams = (req, res) => {
  Team.find()
    .then(teams => res.json(teams))
    .catch(err => res.status(500).send(err));
};

/**
 * GET /teams/:id
 * Ritorna un team per ID
 */
exports.readTeam = (req, res) => {
  Team.findById(req.params.id)
    .then(team => {
      if (!team) {
        return res.status(404).send('Team not found');
      }
      res.json(team);
    })
    .catch(err => res.status(500).send(err));
};

/**
 * POST /teams
 * Crea un nuovo team
 */
exports.createTeam = (req, res) => {
  const team = new Team(req.body);

  team.save()
    .then(doc => res.status(201).json(doc))
    .catch(err => res.status(500).send(err));
};

/**
 * PUT /teams/:id
 * Aggiorna un team
 */
exports.updateTeam = (req, res) => {
  Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .then(team => {
      if (!team) {
        return res.status(404).send('Team not found');
      }
      res.json(team);
    })
    .catch(err => res.status(500).send(err));
};

/**
 * DELETE /teams/:id
 * Elimina un team
 */
exports.deleteTeam = (req, res) => {
  Team.findByIdAndDelete(req.params.id)
    .then(team => {
      if (!team) {
        return res.status(404).send('Team not found');
      }
      res.json({ message: 'Team deleted' });
    })
    .catch(err => res.status(500).send(err));
};
