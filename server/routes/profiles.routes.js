import { Router } from 'express';
const router = new Router();

const passport = require('passport');
const passportService = require('../services/passport');

const requireAuth = passport.authenticate('jwt', {  session:false });
const requireSignin = passport.authenticate('local', {  session:false });

const profilesControllers = require('../controllers/profiles.controllers.js');

// Make every request go through the passport profilesentication check:
router.route('/auth-test').get(requireAuth, function(req, res){
    console.log("req " + JSON.stringify(req.user));
    res.send({ message:'Successfully accessed protected API!'});
});

/* Take a request from a url and send a response. */
router.route('/auth/join').post(profilesControllers.signup);
router.route('/auth/login').post(requireSignin, profilesControllers.signin);

router.route('/auth/profile').get(requireAuth, profilesControllers.getUser);
router.route('/purchase').post(requireAuth, profilesControllers.payment);
router.route('/update-wordcount').post(requireAuth, profilesControllers.updateWordcount);


export default router;

