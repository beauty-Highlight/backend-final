var express = require('express');
var router = express.Router();

const { 
  store,
  index,
  showByServiceId,
  showByWorkerId,
  destroy
} = require('../controllers/specialistController');
const isAdmin = require('../middlewares/isAdmin');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isAuthorized = require('../middlewares/isAuthorized');

router.post('/',
//  isAuthenticated, isAdmin,
  store)
router.get('/',
//  isAuthenticated, isAdmin,
 index)
router.get('/services/:id', showByServiceId)
router.get('/workers/:id', showByWorkerId)
router.delete('/:id', 
// isAuthenticated, isAdmin,
 destroy)

module.exports = router;


  

// npx sequelize-cli model:generate --name Specialist --attributes serviceId:integer,workerId:integer