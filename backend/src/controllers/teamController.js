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
 */
exports.createTeam = (req, res) => {
  const team = new Team(req.body);

  team.save()
    .then(doc => res.status(201).json(doc))
    .catch(err => res.status(500).send(err));
};

/**
 * PUT /teams/:id
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
