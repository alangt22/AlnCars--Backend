const router = require('express').Router()
const CarController = require('../controller/CarController')
// middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

// Car routes
router.post('/create', verifyToken, imageUpload.array('images'), CarController.create)  
router.get('/', CarController.getAll)
router.get('/mycars', verifyToken, CarController.getAllUserCars)
router.get('/mybuyers', verifyToken, CarController.getAllUserBuyer)
router.get('/:id', CarController.getCarById)
router.delete('/:id', verifyToken, CarController.removeCarById)
router.patch('/:id', verifyToken, imageUpload.array('images'), CarController.updateCar)
router.patch('/schedule/:id', verifyToken, CarController.schedule)
router.patch('/conclude/:id', verifyToken, CarController.concludeBuyer)



module.exports = router
