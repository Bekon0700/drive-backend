const express = require('express')
const path = require('path');
const fs = require('fs');
const cors = require('cors')
const morgan = require('morgan')

const app = express();

app.use(cors())
app.use(morgan('dev'))

app.use('/files', express.static(__dirname + '/assets'));

const pathName = 'assets/'

const dirPath = path.join(__dirname, pathName)
// console.log(__dirname)
// console.log(dirPath)

const files = fs.readdirSync(dirPath)
console.log(files)

const pdfs = files.filter(el => el.includes('.pdf')).map(el => {
    return {
        fileName: path.basename(el, '.pdf'),
        path: dirPath + el
    }
})
const imgs = files.filter(el => el.includes('.jpg')).map(el => {
    return {
        fileName: path.basename(el, '.jpg'),
        path: dirPath + el
    }
})
const folders = files.filter(el => el.includes('folder')).map(el => {
    return {
        fileName: el,
        path: dirPath + el
    }
})

app.get('/', (req, res) => {
    res.json({
        staus: 'success',
        pdfs,
        imgs,
        folders
    })
})


app.listen(5050, () => {
    console.log('server is running on port 5050')
})