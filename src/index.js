import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import env from "dotenv";
import findOrCreate from "mongoose-findorcreate";
import _ from "lodash";
import MongoStore from "connect-mongo";

const app = express();
const port = 3000;

env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.jsjp4y3.mongodb.net/${process.env.ATLAS_DB}`, 
    ttl: 14 * 24 * 60 * 60
  }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.jsjp4y3.mongodb.net/${process.env.ATLAS_DB}`);

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
  userId: {
    type: String,
    required: true,
  },
});

wordSchema.index({ word: 1, userId: 1 }, { unique: true });

const Word = mongoose.model("word", wordSchema);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/words",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);

      User.findOrCreate(
        { googleId: profile.id, name: profile.displayName },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/words",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/",
  }),
  function (req, res) {
    res.redirect("http://localhost:5173/words");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Looged out." });
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("http://localhost:5173/");
}

app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.status(401).send(null);
  }
});

app
  .route("/words")
  .get(ensureAuthenticated, (req, res) => {
    Word.find({ userId: req.user.id })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post(ensureAuthenticated, async (req, res) => {
    try {
      if(!req.body.word?.trim() || !req.body.meaning?.trim()){
        return res.status(400).json({message:"Word or its meaning cannot be empty."})
      }
      const trimmedWord = _.capitalize(req.body.word.trim());
      const existingWord = await Word.findOne({
        word: trimmedWord,
        userId: req.user.id,
      });
      if (existingWord) {
        return res
          .status(400)
          .json({ message: "You already added this word." });
      }
      const word = new Word({
        word: trimmedWord,
        meaning: req.body.meaning.trim(),
        userId: req.user.id,
      });
      const result = await word.save();
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong." });
    }
  })
  .delete(ensureAuthenticated, (req, res) => {
    Word.deleteMany({})
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  });

app
  .route("/words/:wordId")
  .get(ensureAuthenticated, (req, res) => {
    Word.findOne({ _id: req.params.wordId })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .patch(ensureAuthenticated, (req, res) => {
    Word.findOneAndUpdate(
      { _id: req.params.wordId },
      { $set: req.body },
      { new: true }
    )
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete(ensureAuthenticated, (req, res) => {
    Word.findByIdAndDelete({ _id: req.params.wordId })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
