import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { prisma } from "./prisma";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
      profileFields: ["id", "displayName", "emails"],
    },
    async function (_accessToken, _refreshToken, profile, done) {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error("No email found on Facebook profile. Facebook accounts without a verified email cannot be used."));
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              provider: "facebook",
              facebookId: profile.id,
              emailVerified: true,
            },
          });
        } else if (!user.facebookId) {
          user = await prisma.user.update({
            where: { email },
            data: { facebookId: profile.id },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;
