const fs = require("fs");
const http = require("http");
const path = require("path");
const http2 = require("http2");
const Router = require("router");
const sha512 = require("js-sha512");
const Database = require("./db");
const compression = require("compression");

const User = require("./db/user");
const config = require("./utils/conf")(process.argv[2] || "dev");
const db = new Database();

if (!fs.existsSync(path.join(__dirname, "..", "files"))) {

	console.log("[INFO] Created \"files\" folder");
	fs.mkdirSync(path.join(__dirname, "..", "files"));

}

if (!fs.existsSync(path.join(__dirname, "..", "plugins"))) {

	console.log("[INFO] Created \"plugins\" folder");
	fs.mkdirSync(path.join(__dirname, "..", "plugins"));

}

(async () => {

	const users = await db.users();

	if (!users.find(_ => _.username === "admin")) {

		const password = Math.random().toString(36).replace("0.", "");

		console.log(`[IMPORTANT] Creating "admin" user with password "${password}"`);

		await db.addUser(new User(db, null, "admin", "a@dm.in", sha512.sha512(password), "admin", {}));

		console.log("[IMPORTANT] Created \"admin\" user");

	}

})();

/**
 * @type {Router}
 */
const router = new Router();

if (config.server.compression) router.use(compression());
router.use("/api", require("./routes/api"));
router.use("/admin", require("./routes/admin"));

/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function handler (req, res) {

	req.on("error", () => {});
	res.on("error", () => {});

	router(req, res, () => {

		res.writeHead(404, {});

		res.end("Error: Page not found");

	});

}

let server = http.createServer((req, res) => {
	
	if (config.server.secure) {

		res.writeHead(302, {
			
			"Location": `https://${req.headers["host"]}${req.url}`

		});

		res.end();

	} else {

		handler(req, res);

	}

});

let serverSecure;

if (config.server.secure) {

	serverSecure = http2.createSecureServer({

		ca: config.server.caPath ? fs.readFileSync(path.join(__dirname, "..", config.server.caPath)) : undefined,
		key: fs.readFileSync(path.join(__dirname, "..", config.server.keyPath || "server.key")),
		cert: fs.readFileSync(path.join(__dirname, "..", config.server.certPath || "server.cert"))

	}, handler);

	serverSecure.listen(config.server.securePort || config.server.port);

}

process.on("uncaughtException", err => {

	console.log(err.stack);
	console.log("Server not terminating");

});

const www = require("./routes/www");
www.sync();
router.use(www);

server.listen(config.server.port, () => {require("./plugins").load();});
