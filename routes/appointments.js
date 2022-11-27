var express = require('express');
var router = express.Router();

const { 
  store,
  index,
  show,
  update,
  destroy,
  schedule,
  allApp
} = require('../controllers/appointmentController');

const isCustomer = require('../middlewares/isCustomer');
const isAuthenticated = require('../middlewares/isAuthenticated');
const canControlAppointment = require('../middlewares/canControlAppointment');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', isAuthenticated, isCustomer, store)
router.get('/', isAuthenticated, index)
router.get('/all', isAuthenticated,isAdmin, allApp)
router.post('/schedule/:id', schedule)
router.get('/:id', isAuthenticated, isCustomer, show)
router.put('/:id', isAuthenticated, update)
router.delete('/:id', isAuthenticated, destroy)


// router.post('/',isAuthenticated, store)
// router.get('/', index)
// router.get('/all', isAuthenticated,isAdmin, allApp)
// router.post('/schedule/:id', schedule)
// router.get('/:id', show)
// router.put('/:id', update)
// router.delete('/:id', destroy)

module.exports = router;