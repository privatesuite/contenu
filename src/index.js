const fs = require("fs");
const http = require("http");
const http2 = require("http2");
const mime = require("mime");
const path = require("path");
const Router = require("router");
const sha512 = require("js-sha512");
const Database = require("./db");
const finalhandler = require("finalhandler");

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

router.use("/api", require("./routes/api"));
router.use("/admin", require("./routes/admin"));

let server = http.createServer((req, res) => {
	
	if (config.server.secure) {

		res.writeHead(302, {
			
			"Location": `https://${req.headers["host"]}${req.url}`

		});

		res.end();

	} else {

		req.on("error", () => {});
		res.on("error", () => {});

		router(req, res, finalhandler(req, res));

	}

});

let serverSecure;

if (config.server.secure) {

	serverSecure = http2.createSecureServer({

		ca: config.server.caPath ? fs.readFileSync(path.join(__dirname, "..", config.server.caPath)) : undefined,
		key: fs.readFileSync(path.join(__dirname, "..", config.server.keyPath || "server.key")),
		cert: fs.readFileSync(path.join(__dirname, "..", config.server.certPath || "server.cert"))

	}, (req, res) => {

		req.on("error", () => {});
		res.on("error", () => {});

		router(req, res, finalhandler(req, res));

	});

	serverSecure.listen(config.server.securePort || config.server.port);

}

router.get("*", (req, res, next) => {

	let file = path.join(__dirname, "..", "www", req.url === "/" ? "index.html" : req.url);

	if (fs.existsSync(file)) {

		const stat = fs.statSync(file);

		res.writeHead(200, {

			"Content-Type": mime.getType(file) || "application/octet-stream",
			"Content-Length": stat.size

		});

		fs.createReadStream(file).pipe(res);

	} else {

		next();

	}

});

process.on("uncaughtException", err => {

	console.error(err.stack);
	console.log("Server not terminating");

});  

server.listen(config.server.port, () => {require("./plugins").load();});
