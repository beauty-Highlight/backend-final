var express = require('express');
var router = express.Router();
const multer = require('multer')


const { 
  store,
  index,
  show,
  update,
  destroy,
  setWorkers
} = require('../controllers/serviceController');
const isAdmin = require('../middlewares/isAdmin');
const isAuthenticated = require('../middlewares/isAuthenticated');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.split('.')
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext[ext.length - 1])
    }
  })
  const upload = multer({ storage: storage })

router.post('/', isAuthenticated, isAdmin, upload.single('image'), store)
// router.post('/', upload.single('image'), store)

router.get('/', index)
router.post('/workers/:id', isAuthenticated, isAdmin, setWorkers);
router.get('/:id', show)
router.put('/:id', isAuthenticated, isAdmin, upload.single('image'),update)
router.delete('/:id', isAuthenticated, isAdmin, destroy)

module.exports = router;

