const mongoose = require('../db/conn')
const { Schema } = mongoose

const Car = mongoose.model(
    'Car',
    new Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        km: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        transmission: {
            type: String,
            required: true, 
        },
        year: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        fuel: {
            type: String, // Tipo de combustível
            required: true
        },
        motor: {
            type: String, // Tipo de motor, ex: 2.0, 1.6, etc.
            required: true
        },
        location: {
            type: String, // Localização do carro
            required: true
        },
        features: {
            type: [String], 
            default: []
        },
        images: {
            type: Array,
            required: true
        },
        available: {
            type: Boolean
        },
        user: Object,
        buyer: Object
    },
    {timestamps: true},
  )
)

module.exports = Car