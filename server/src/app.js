const http = require('http')
const conf = require('./config/defaultConfig')
const chalk = require('chalk')
const route = require('./helper/route')
const mysql = require('mysql')
const path = require('path')
const url = require('url')
const assets = require('./helper/assets')

class Server {
	constructor(config) {
		this.conf = Object.assign({}, conf, config)	// 获取配置
	}

	start() {
		const server = http.createServer((req, res) => {
			// 数据库连接配置
			const connection = mysql.createConnection({
				host: '127.0.0.1',
				user: 'root',
				password: '13377626189K',
				database: 'stu_domitory_schema',
				timezone: "08:00"
			})
			
			connection.connect()	// 连接数据库
			const filePath = url.parse(req.url).pathname	// 请求路径
			// 区分路由
			if (filePath != '/favicon.ico') {
				if (path.extname(filePath) !== '' || filePath == '/') {
					// 请求为静态资源
					assets(req, res, filePath)
				} else {
					// 非静态资源
					route(req, res, connection, filePath)	
				}	
			} else {
				res.end()
			}
		})
		
		server.listen(this.conf.port, this.conf.hostname, () => {
			const address = `http://${this.conf.hostname}:${this.conf.port}`
			console.log(`Server started at ${chalk.green(address)}`)
		})
	}
}

module.exports = Server