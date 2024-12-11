const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Configuração do armazenamento de imagens
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        let folder = "";

        // Verificar o caminho dependendo do tipo de arquivo (users ou cars)
        if(req.baseUrl.includes("users")){
            folder = "users";
        }else if(req.baseUrl.includes("cars")){
            folder = "cars";
        }

        // Definir o caminho do diretório onde as imagens serão salvas
        const dirPath = path.join(__dirname, 'public', 'images', folder);

        // Verificar se o diretório existe; se não, criar
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        cb(null, dirPath); // Pasta para armazenar as imagens
    },
    filename: function (req, file, cb) {
        // Gerar um nome de arquivo único baseado no timestamp e um número aleatório
        cb(
            null, 
            Date.now() + 
                String(Math.floor(Math.random() * 1000)) + 
                path.extname(file.originalname) // Adicionar a extensão original do arquivo
        );
    },
});

// Configuração do multer com filtro para aceitar apenas imagens
const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Por favor, envie apenas arquivos de imagem!'));
        }
        cb(undefined, true); // Aceitar o arquivo
    }
});

// Exportando o middleware de upload de imagem
module.exports = { imageUpload };
