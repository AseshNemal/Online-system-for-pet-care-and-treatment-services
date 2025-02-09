import GoogleStrategy from "passport-google-oauth20"
import config from "."
import logger from "../utils/logger"

const googleAuth =(passport) => {
    GoogleStrategy.Strategy;

    console.log(config);

    passport.use(new GoogleStrategy({
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_REDIRECT_URL, // Corrected the typo
  }, (accessToken, refreshToken, profile, callback) => { // Fixed typo in accessToken
      console.log(profile);
      return callback(null, profile);
}

));

passport.serializeUser(function(user, callback) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, callback) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}; 
 export { googleAuth };
