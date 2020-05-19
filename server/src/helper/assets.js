const mime = require('./mime')
const promisify = require('util').promisify
const range = require('./range')
const fs = require('fs')
const stat = promisify(fs.stat)
const path = require('path')
const config = require('../config/defaultConfig')
const compress = require('./compress')

module.exports = async function(req, res, filePath) {
    // 当请求为根路径时返回主页
    if (filePath == '/') {
        filePath = '/index.html'
    }

    filePath = path.join(`${__dirname}../../../dist/`, filePath)    // 获得绝对路径
    const contentType = mime(filePath)  // 获得请求的静态资源的mime
    res.setHeader('Content-Type', contentType)
    let rs
    const stats = await stat(filePath)   // 获取文件的状态
    const { code, start, end } = range(stats.size, req, res)
    if (code === 200) {
        //全部传输
        res.statusCode = 200
        rs = fs.createReadStream(filePath)
    } else {
        //范围请求传输
        res.statusCode = 206
        rs = fs.createReadStream(filePath, { start, end })
    }

    if (filePath.match(config.compress)) {
        rs = compress(rs, req, res) // 压缩传输
    }

    rs.pipe(res)
}