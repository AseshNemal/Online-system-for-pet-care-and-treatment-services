import GoogleStrategy from "passport-google-oauth20";
import config from "../configs/index.js";
import User from "../API/model/user.model.js";

const googleAuth = (passport) => {
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_REDIRECT_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const userObj = {
            googleId: profile.id,
            displayName: profile.displayName,
            gmail: profile.emails[0].value,
            image: profile.photos?.[0]?.value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
          };

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create(userObj);
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  
  passport.serializeUser((user, done) => {
    done(null, user.id); 
  });


  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export { googleAuth };
