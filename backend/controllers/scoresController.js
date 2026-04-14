const admin = require("firebase-admin");

const db = admin.firestore();

const saveScore = async (req, res, next) => {
  try {
    const { score, correctAnswers, totalQuestions, comboMax, artist } = req.body;
    const userId = req.user.uid;

    if (score === undefined || correctAnswers === undefined || totalQuestions === undefined) {
      return res
        .status(400)
        .json({ error: "score, correctAnswers, and totalQuestions are required" });
    }

    const scoreData = {
      userId,
      score,
      correctAnswers,
      totalQuestions,
      comboMax: comboMax || 0,
      artist: artist || "unknown",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("scores").add(scoreData);

    res.status(201).json({ message: "Score saved", id: docRef.id, score: scoreData });
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const snapshot = await db
      .collection("scores")
      .orderBy("score", "desc")
      .limit(10)
      .get();

    const leaderboard = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ leaderboard });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveScore, getLeaderboard };
