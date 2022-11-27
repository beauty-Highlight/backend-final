var express = require('express');
var router =express.Router();
// const { sign } = require('jsonwebtoken');
const multer =require('multer');
const { store, show, index, destroy, update, login , profile} = require('../controllers/customerController');
var isAuthenticated = require('../middlewares/isAuthenticated')
var isAuthorized = require('../middlewares/isAuthorized');
const isCustomer = require('../middlewares/isCustomer');

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

router.post('/', upload.single('image'), store);
router.get('/profile',isAuthenticated, isCustomer, profile);
router.get('/:id',isAuthenticated, isCustomer, show);
router.get('/', index);
router.delete('/:id',isAuthenticated,isAuthorized,destroy);
router.put('/profile/update',isAuthenticated,isCustomer,upload.single('image'),update)
router.post('/login',login)




module.exports = router;