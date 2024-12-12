const Car = require('../models/Car')
const path = require('path');
const fs = require('fs');

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const objectId = require('mongoose').Types.ObjectId

module.exports = class CarController {
    // create a pet
    static async create(req, res) {
        const {name, price, km, brand, transmission, year, color, fuel, motor, location, moreInfo,  features} = req.body
        const images = req.files

        const available = true

        // upload images

        // validation
        if(!name) {
            res.status(422).json({message: "O nome e obrigatorio!"})
            return
        }

        if(!price) {
            res.status(422).json({message: "O preço e obrigatoria!"})
            return
        }

        if(!km) {
            res.status(422).json({message: "O Kme obrigatorio!"})
            return
        }

        if(!brand) {
            res.status(422).json({message: "A Marca e obrigatoria!"})
            return
        }
        if(!transmission) {
            res.status(422).json({message: "O cambio e obrigatoria!"})
            return
        }
        if(!year) {
            res.status(422).json({message: "O Ano e obrigatoria!"})
            return
        }
        if(!color) {
            res.status(422).json({message: "A cor e obrigatoria!"})
            return
        }
        if(!fuel) {
            res.status(422).json({message: "O Combustivel e obrigatoria!"})
            return
        }
        if(!location) {
            res.status(422).json({message: "A localização  e obrigatoria!"})
            return
        }
        if(!motor) {
            res.status(422).json({message: "O motor  e obrigatoria!"})
            return
        }
        if(!moreInfo) {
            res.status(422).json({message: "As informações são obrigatoria!"})
            return
        }
        if(images.lenght === 0) {
            res.status(422).json({message: "A imagem e obrigatoria!"})
            return
        }
        //get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a pet
        const car = new Car ({
            name,
            price,
            km,
            brand,
            transmission,
            available,
            year,
            color,
            fuel,
            motor,
            moreInfo,
            location,
            // Ajuste o código para garantir que features seja um array de strings
            features: features ? features.split(',').map(feature => feature.trim()) : [],
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        }) 

        images.map((image) => {
            car.images.push(image.filename)
        })

        try {
            const newCar = await car.save()
            res.status(201).json({message: "Carro cadastrado com sucesso!", newCar})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
    static async getAll(req, res) {
        const cars = await Car.find().sort('-createdAt')

        res.status(200).json({cars: cars,})
    }
    static async getAllUserCars(req, res) {
        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const cars = await Car.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({cars})
    }
    static async getAllUserBuyer(req, res) {
        //get user
        const token = getToken(req)
        const user = await getUserByToken(token)

        const cars = await Car.find({'buyer._id': user._id}).sort('-createdAt')

        res.status(200).json({cars})   
    }
    static async getCarById(req, res) {
        const id = req.params.id

        if(!objectId.isValid(id)) {
            res.status(422).json({message: "ID invalido!"})
            return   
        }
        // check if pet exists
        const car = await Car.findOne({_id: id})

        if(!car) {
            res.status(404).json({message: "Carro não encontrado"})
            return  
        }

        res.status(200).json({car: car})
    }
    static async removeCarById(req, res) {
        const id = req.params.id;
    
        // Check if id is valid
        if (!objectId.isValid(id)) {
            return res.status(422).json({ message: "ID inválido!" });
        }
    
        // Check if pet exists
        const car = await Car.findOne({ _id: id });
    
        if (!car) {
            return res.status(404).json({ message: "Carro não encontrado" });
        }
    
        // Get user from token and check if the logged-in user is the owner of the pet
        const token = getToken(req);
        const user = await getUserByToken(token);
    
        if (car.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: "Você não tem permissão para remover este Carro" });
        }
    
        // Remove images associated with the pet
        if (car.images && car.images.length > 0) {
            car.images.forEach((image) => {
                const imagePath = path.join(__dirname, `../public/images/cars/${image}`);
                
                // Check if the image exists and delete it
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }
    
        // Delete the pet from the database
        await Car.findByIdAndDelete(id);
        
        return res.status(200).json({ message: "Carro removido com sucesso!" });
    }
    static async updateCar(req, res) {
        const id = req.params.id
        const {name, price, km, brand, transmission, year, color, fuel, motor, location, moreInfo,  features} = req.body
        const images = req.files
        const updateData = {}
        // check if pet exists
        const car = await Car.findOne({_id: id})

        if(!car) {
            res.status(404).json({message: "Carro não encontrado"})
            return  
        }

        // check if loged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(car.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: "Houve um problema em processar sua solicitação, tente novamente mais tarde"})
            return   
        }

        // validation
        if(!name) {
            res.status(422).json({message: "O nome e obrigatorio!"})
            return
        } else {
            updateData.name = name
        }

        if(!price) {
            res.status(422).json({message: "O Preço e obrigatoria!"})
            return
        } else {
            updateData.price = price
        }

        if(!km) {
            res.status(422).json({message: "O Km e obrigatorio!"})
            return
        } else {
            updateData.km = km
        }

        if(!brand) {
            res.status(422).json({message: "A marca e obrigatoria!"})
            return
        } else {
            updateData.brand = brand
        }
        if(!transmission) {
            res.status(422).json({message: "O cambio e obrigatoria!"})
            return
        } else {
            updateData.transmission = transmission
        }

        if(!year) {
            res.status(422).json({message: "O Ano e obrigatoria!"})
            return
        }else {
            updateData.year = year
        }

        if(!color) {
            res.status(422).json({message: "A cor e obrigatoria!"})
            return
        }else {
            updateData.color = color
        }

        if(!fuel) {
            res.status(422).json({message: "O Combustivel e obrigatoria!"})
            return
        }else {
            updateData.fuel = fuel
        }

        if(!motor) {
            res.status(422).json({message: "O motor e obrigatoria!"})
            return
        }else {
            updateData.motor = motor
        }

        if(!location) {
            res.status(422).json({message: "A localização  e obrigatoria!"})
            return
        }else {
            updateData.location = location
        }

        if(!moreInfo) {
            res.status(422).json({message: "As informações são obrigatorio!"})
            return
        } else {
            updateData.moreInfo = moreInfo
        }

        if(!features) {
            res.status(422).json({message: "O cambio e obrigatoria!"})
            return
        } else {
            updateData.features = features.split(',').map(feature => feature.trim())
        }

        if (images.length > 0) {
            updateData.images = [];  
            
            if (car.images && car.images.length > 0) {
                car.images.forEach((oldImage) => {
    
                    const oldImagePath = path.join(__dirname, `../public/images/cars/${oldImage}`);
        
                    
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);  
                    }
                });
            }
        
           
            images.forEach((image) => {
                updateData.images.push(image.filename);
            });
        }
        


        await Car.findByIdAndUpdate(id, updateData)
        res.status(200).json({message: 'Carro atualizado com sucesso'})
    }
    static async schedule(req, res) {
        const id = req.params.id
        // check if pet exists
        const car = await Car.findOne({_id: id})

        if(!car) {
            res.status(404).json({message: "Carro não encontrado"})
            return  
        }
        // check if user register car
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(car.user._id.equals(user._id)) {
            res.status(422).json({message: "Você não pode agendar visita com seu proprio Carro!"})
            return   
        }
        // check if user has already shchedule a visit
        if(car.buyer) {
            if(car.buyer._id.equals(user._id)) {
                res.status(422).json({message: "Você ja agendou uma visita para esse Carro!"})
                return     
            }
        }

        // add user to pet
        car.buyer = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Car.findByIdAndUpdate(id, car)
        res.status(200).json({message: `Avisita foi agendada com sucesso, entre em contato com ${car.user.name} pelo telefone ${car.user.phone}`})
    }
    static async concludeBuyer(req, res) {
        const id = req.params.id
        // check if pet exists
        const car = await Car.findOne({_id: id})

        if(!car) {
            res.status(404).json({message: "Carro não encontrado"})
            return  
        }

        // check if loged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(car.user._id.toString() !== user._id.toString()) {
            res.status(422).json({message: "Houve um problema em processar sua solicitação, tente novamente mais tarde"})
            return   
        }

        car.available = false

        await Car.findByIdAndUpdate(id, car)
        res.status(200).json({message: 'Parabéns, o ciclo de negociação foi finalizado com sucesso!'})
    }

}   