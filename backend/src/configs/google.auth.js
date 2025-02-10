import GoogleStrategy from "passport-google-oauth20"
import config from "."
import User from "../API/model/user.model";

const googleAuth =(passport) => {
    GoogleStrategy.Strategy;

    console.log(config);

    passport.use(new GoogleStrategy({
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_REDIRECT_URL,
  },
  async (accessToken, refreshToken, profile, callback) => { 
      const userObj = {
        googleId: profile.id,
        displayName: profile.displayName,
        gmail: profile.emails[0].value,
        image: profile.photos[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName
      }
      let user =await User.findOne({ googleId: profile.id})
      if(user){
        return callback(null, user);
      }

      User.create(userObj)
      .then((user) => {
        return callback(null, user);
      })
      .catch((err) => {
        return callback(err.message);
      })
}

));

passport.serializeUser(function(user, callback) {
    callback(null, user.id);
  });
  
  passport.deserializeUser(async (id, callback) => {
    try {
      const user = await User.findById(id);
      callback(null, user);
    } catch (err) {
      callback(err, null);
    }
 
  
  });
}; 
 export { googleAuth };
