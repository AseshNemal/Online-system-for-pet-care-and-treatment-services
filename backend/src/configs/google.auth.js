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
          console.log('Google Strategy - Profile:', profile);
          
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
            console.log('Creating new user:', userObj);
            user = await User.create(userObj);
          } else {
            console.log('Found existing user:', user);
          }

          return done(null, user);
        } catch (err) {
          console.error('Google Strategy Error:', err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', {
      id: user.id,
      displayName: user.displayName,
      email: user.gmail
    });
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user ID:', id);
      const user = await User.findById(id);
      if (!user) {
        console.log('No user found for ID:', id);
        return done(null, false);
      }
      console.log('Deserialized user:', {
        id: user.id,
        displayName: user.displayName,
        email: user.gmail
      });
      done(null, user);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err, null);
    }
  });
};

export { googleAuth };
