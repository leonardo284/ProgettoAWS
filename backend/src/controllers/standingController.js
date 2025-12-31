const Standing = require("../models/standing");

/**
 * GET /standings
 * Lista completa (ordinata)
 */
exports.listStandings = async (req, res) => {
  try {
    const { season = "2025/2026" } = req.query;

    const standings = await Standing.find({ season })
      .sort({ points: -1, goalDifference: -1, goals: -1 });

    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /standings/:teamId
 */
exports.readStanding = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season = "2025/2026" } = req.query;

    const standing = await Standing.findOne({ teamId, season });
    if (!standing) {
      return res.status(404).json({ message: "Standing not found" });
    }

    res.json(standing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /standings/:teamId
 */
exports.updateStanding = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season = "2025/2026" } = req.query;

    const standing = await Standing.findOneAndUpdate(
      { teamId, season },
      req.body,
      { new: true }
    );

    if (!standing) {
      return res.status(404).json({ message: "Standing not found" });
    }

    res.json(standing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /standings/:teamId
 */
exports.deleteStanding = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season = "2025/2026" } = req.query;

    const deleted = await Standing.findOneAndDelete({ teamId, season });

    if (!deleted) {
      return res.status(404).json({ message: "Standing not found" });
    }

    res.json({ message: "Standing deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /standings/top/:n
 */
exports.getTopN = async (req, res) => {
  try {
    const n = parseInt(req.params.n);
    const { season = "2025/2026" } = req.query;

    const standings = await Standing.find({ season })
      .sort({ points: -1, goalDifference: -1, goals: -1 })
      .limit(n);

    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /standings/bottom/:n
 */
exports.getBottomN = async (req, res) => {
  try {
    const n = parseInt(req.params.n);
    const { season = "2025/2026" } = req.query;

    const standings = await Standing.find({ season })
      .sort({ points: 1, goalDifference: 1, goals: 1 })
      .limit(n);

    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
