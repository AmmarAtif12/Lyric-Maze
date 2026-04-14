const admin = require("firebase-admin");

const db = admin.firestore();

const signup = async (req, res, next) => {
  try {
    const { uid, email, displayName } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: "uid and email are required" });
    }

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(409).json({ error: "User already exists" });
    }

    const userData = {
      uid,
      email,
      displayName: displayName || "",
      favoriteArtists: [],
      highScore: 0,
      gamesPlayed: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(userData);

    res.status(201).json({ message: "User created successfully", user: userData });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "uid is required" });
    }

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: userDoc.data() });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: userDoc.data() });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { displayName, favoriteArtists } = req.body;

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (favoriteArtists !== undefined) updates.favoriteArtists = favoriteArtists;

    await userRef.update(updates);

    const updatedDoc = await userRef.get();
    res.json({ user: updatedDoc.data() });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getProfile, updateProfile };
