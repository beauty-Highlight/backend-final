var express = require('express');
var router = express.Router();

const { 
  store,
  index,
  show,
  update,
  destroy
} = require('../controllers/reviewController');

const isAuthenticated = require('../middlewares/isAuthenticated');
const isAuthorized = require('../middlewares/isAuthorized');
const isCustomer = require('../middlewares/isCustomer');

router.post('/', isAuthenticated, isCustomer, store)
router.get('/', index)
router.get('/myReviwes',isAuthenticated, isCustomer, show)
router.put('/:id', isAuthenticated, isAuthorized, update)
router.delete('/:id', isAuthenticated, isCustomer, destroy)

module.exports = router;
