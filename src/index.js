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
	
	res.writeHead(302, {
		
		"Location": `https://${req.headers["host"]}${req.url}`

	});

	res.end();

});

let serverSecure;

if (config.server.secure) {

	serverSecure = http2.createSecureServer({

		key: fs.readFileSync(path.join(__dirname, "..", config.server.keyPath || "server.key")),
		cert: fs.readFileSync(path.join(__dirname, "..", config.server.certPath || "server.cert"))

	}, (req, res) => {

		router(req, res, finalhandler(req, res));

	});

	serverSecure.listen(config.server.securePort || config.server.port);

}

router.get("*", (req, res, next) => {

	let file = path.join(__dirname, "..", "www", req.url === "/" ? "index.html" : req.url);

	if (fs.existsSync(file)) {

		const stat = fs.statSync(file);

		res.writeHead(200, {

			"Content-Type": mime.getType(file),
			"Content-Length": stat.size

		});

		fs.createReadStream(file).pipe(res);

	} else {

		next();

	}

});

server.listen(config.server.port);
