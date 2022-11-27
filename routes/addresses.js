var express = require('express');
var router = express.Router();

const { 
  store,
  index,
  show,
  update,
  destroy
} = require('../controllers/addressController');

const canControlAddress = require('../middlewares/canControlAddress');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isCustomer = require('../middlewares/isCustomer');

router.post('/', isAuthenticated, isCustomer, store)
router.get('/',isAuthenticated, isCustomer,index)
// router.get('/:id', show)
router.put('/:id', isAuthenticated, update)
router.delete('/:id', destroy)

module.exports = router;
