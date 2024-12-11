const { error } = require('console')
const multer = require('multer')
const path = require('path')

// destination to store the image
const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        let folder = ""

        if(req.baseUrl.includes("users")){
            folder = "users"
        }else if(req.baseUrl.includes("cars")){
            folder = "cars"
        }

        // Verificar se o diretório existe; se não, criar
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        cb(null, dirPath); // Pasta para armazenar as imagens
    },
    filename: function (req, file, cb) {
        cb(
            null, 
            Date.now() + 
                String(Math.floor(Math.random() * 1000)) + 
                path.extname(file.originalname))
    },
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Por favor, envie apenas arquivos de imagem!'))
        }
        cb(undefined, true)      
    }
});


module.exports = {imageUpload}