var express = require('express');
const { sign } = require('jsonwebtoken');
var router = express.Router();

const { 
  store,
  index,
  show,
  update,
  destroy,
  signIn
} = require('../controllers/adminController');

const isAuthenticated = require('../middlewares/isAuthenticated');
const isAdmin = require('../middlewares/isAdmin');



router.post('/', store)
router.post('/logIn',signIn)
router.get('/', isAuthenticated, isAdmin, index)
////////////////////////////// router.get('/:id', isAuthenticated, isAdmin, show)
router.put('/:id', isAuthenticated, isAdmin, update)
router.delete('/:id', isAuthenticated, isAdmin, destroy)



module.exports = router;
