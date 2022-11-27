var express = require('express');
var router = express.Router();
const multer = require('multer')
const isAdmin = require('../middlewares/isAdmin')

const { 
  store,
  index,
  show,
  update,
  destroy
} = require('../controllers/galleryController');
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

router.post('/',upload.single('file'),  isAuthenticated, isAdmin,store)
router.get('/', index)
router.get('/:id', show)
router.put('/:id',upload.single('file'),  isAuthenticated, isAdmin, update)
router.delete('/:id',  isAuthenticated, isAdmin, destroy)

module.exports = router;
