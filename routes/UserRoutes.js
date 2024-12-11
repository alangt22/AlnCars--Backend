const router = require('express').Router();
const UserController = require('../controller/UserController');

// Middleware para verificar o token de autenticação
const verifyToken = require('../helpers/verify-token');

// Importando o middleware para upload de imagem
const { imageUpload } = require('../helpers/image-upload');

// Rota para registro de usuário
router.post('/register', UserController.register);

// Rota para login de usuário
router.post('/login', UserController.login);

// Rota para verificar o usuário
router.get('/checkuser', UserController.checkUser);

// Rota para pegar os dados de um usuário específico
router.get('/:id', UserController.getUserById);

// Rota para editar um usuário (com upload de imagem de perfil)
router.patch(
    '/edit/:id',
    verifyToken, // Verificar o token
    imageUpload.single("image"), // Upload de uma imagem (campo 'image' no formulário)
    UserController.editUser // Controlador para editar o usuário
);

// Middleware para tratar erros
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).send({ error: err.message });
    }
    if (err) {
        return res.status(500).send({ error: 'Erro no servidor' });
    }
    next(); // Passa o erro para o próximo middleware (se houver)
});

module.exports = router;
