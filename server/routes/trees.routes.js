import { Router } from 'express';
import * as treeControllers from '../controllers/tree.controllers';
const router = new Router();

const passport = require('passport');
const passportService = require('../services/passport');
const requireAuth = passport.authenticate('jwt', {  session:false });

router.route('/trees').get(requireAuth, treeControllers.listTrees);
router.route('/trees').post(requireAuth, treeControllers.createTree);
router.route('/tree/:slug').get(treeControllers.getTree);
router.route('/tree/:slug').post(requireAuth, treeControllers.updateTree);
router.route('/tree/:slug').delete(requireAuth, treeControllers.deleteTree);


export default router;
