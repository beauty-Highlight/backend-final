var express = require('express');
var router = express.Router();

const { 
  store,
  index,
  show,
  update,
  destroy,
  schedule
} = require('../controllers/appointmentController');

const isCustomer = require('../middlewares/isCustomer');
const isAuthenticated = require('../middlewares/isAuthenticated');
const canControlAppointment = require('../middlewares/canControlAppointment');

router.post('/', isAuthenticated, isCustomer, store)
router.get('/', isAuthenticated, index)
router.post('/schedule/:id', schedule)
router.get('/:id', isAuthenticated, isCustomer, show)
router.put('/:id', isAuthenticated, update)
router.delete('/:id', isAuthenticated, destroy)

module.exports = router;