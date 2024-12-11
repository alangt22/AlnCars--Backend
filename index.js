const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(cors({
  origin: ['https://aln-cars.netlify.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));


app.use(express.json());

app.use(express.static('public'));

// Rotas
const UserRoutes = require('./routes/UserRoutes');
const CarsRoutes = require('./routes/CarsRoutes');


app.use('/users', UserRoutes);
app.use('/cars', CarsRoutes );




app.options('*', cors()); 

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});

module.exports = app;
