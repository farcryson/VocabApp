import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import findOrCreate from "mongoose-findorcreate";
import _ from "lodash";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontend = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: frontend, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
});
userSchema.plugin(findOrCreate);

const User = mongoose.model("user", userSchema);

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  meaning: {
    type: String,
    required: true,
  },
  correctCount: Number,
  incorrectCount: Number,
  userId: {
    type: String,
    required: true,
  },
});

wordSchema.index({ word: 1, userId: 1 }, { unique: true });

const Word = mongoose.model("word", wordSchema);

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name } = payload;

    const user = await User.findOrCreate({ googleId, name }).then(r => r.doc);

    const jwtToken = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token: jwtToken, user: { id: user._id, name: user.name } });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.sendStatus(403);
  }
});

app.get("/user", authenticateToken, (req, res) => {
  res.json(req.user);
});

app
  .route("/words")
  .get(authenticateToken, (req, res) => {
    Word.find({ userId: req.user.id })
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err));
  })
  .post(authenticateToken, async (req, res) => {
    try {
      if (!req.body.word?.trim() || !req.body.meaning?.trim()) {
        return res.status(400).json({ message: "Word or meaning is empty" });
      }

      const trimmedWord = _.capitalize(req.body.word.trim());
      const existingWord = await Word.findOne({
        word: trimmedWord,
        userId: req.user.id,
      });

      if (existingWord) {
        return res.status(400).json({ message: "Word already exists" });
      }

      const word = new Word({
        word: trimmedWord,
        meaning: req.body.meaning.trim(),
        correctCount: 0,
        incorrectCount: 0,
        userId: req.user.id,
      });

      const result = await word.save();
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong." });
    }
  })
  .delete(authenticateToken, (req, res) => {
    Word.deleteMany({ userId: req.user.id })
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err));
  });

app
  .route("/words/:wordId")
  .get(authenticateToken, (req, res) => {
    Word.findOne({ _id: req.params.wordId, userId: req.user.id })
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err));
  })
  .patch(authenticateToken, (req, res) => {
    Word.findOneAndUpdate(
      { _id: req.params.wordId, userId: req.user.id },
      { $set: req.body },
      { new: true }
    )
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err));
  })
  .delete(authenticateToken, (req, res) => {
    Word.findOneAndDelete({ _id: req.params.wordId, userId: req.user.id })
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err));
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
