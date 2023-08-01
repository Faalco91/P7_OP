const express = require('express');
const router = express.Router(); 

const auth = require('../middleware/auth')
const bookCtrl = require('../controllers/stuff');
const multer = require('../middleware/multer-config')


router.post('/', auth, multer, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBooksBestRating);
router.post('/:id/rating', auth, bookCtrl.createBookRating);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id',auth, multer, bookCtrl.modifyOneBook);
router.delete('/:id', auth, multer, bookCtrl.deleteOneBookRating);


module.exports = router;