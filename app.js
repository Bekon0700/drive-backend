const express = require('express')
const path = require('path');
const fs = require('fs');
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const app = express();


app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, req.headers.path)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

app.use('/files', express.static(__dirname + '/assets'));

const getFiles = (folderName) => {
    const pathName = folderName
    // console.log(pathName)

    // console.log(pathName)

    const dirPath = path.join(__dirname, pathName)

    const files = fs.readdirSync(dirPath)
    // console.log(files)

    const pdfs = files.filter(el => el.includes('.pdf')).map(el => {
        const filePathLen = folderName.split('/')
        const filePath = filePathLen.slice(1, filePathLen.length).join('/')
        return {
            fileName: el,
            path: filePath + '/' + el
        }
    })
    const imgs = files.filter(el => el.includes('.jpg', '.png', '.jpeg')).map(el => {
        const filePathLen = folderName.split('/')
        const filePath = filePathLen.slice(1, filePathLen.length).join('/')
        return {
            fileName: el,
            path: filePath + '/' + el
        }
    })
    const folders = files.filter(el => el.split('.').length == 1).map(el => {
        // console.log(el)
        return {
            fileName: el,
            path: el
        }
    })
    return {
        pdfs,
        imgs,
        folders
    }
}

app.post('/', (req, res) => {
    const filePath = req.body.path
    const {pdfs, imgs, folders} = getFiles(filePath)
    res.json({
        staus: 'success',
        pdfs,
        imgs,
        folders
    })
})

app.post('/create-folder', (req, res) => {
    const {path, name} = req.body
    const dir = path + '/' + name;
    if (!fs.existsSync(dir)){    //check if folder already exists
        fs.mkdirSync(dir);    //creating folder
    }
    res.status(200).json({
        status: 'success'
    })
})
app.post('/upload-file', upload.single('file'), (req, res) => {
    res.status(200).json({
        status: 'upload success'
    })
})


app.listen(5050, () => {
    console.log('server is running on port 5050')
})