const fs = require("fs");
const http = require("http");
const mime = require("mime");
const path = require("path");
const Router = require("router");
const sha512 = require("js-sha512");
const Database = require("./db");
const finalhandler = require("finalhandler");

const User = require("./db/user");

const config = require("./utils/conf")(process.argv[2] || "dev");

var db = new Database();

(async () => {

	var users = await db.users();

	if (!users.find(_ => _.username === "admin")) {
		
		var password = Math.random().toString(36).replace("0.", "");

		console.log(`[IMPORTANT] Creating "admin" user with password "${password}"`);

		await db.addUser(new User(db, null, "admin", "a@dm.in", sha512.sha512(password), "admin"));

		console.log("[IMPORTANT] Created \"admin\" user");

	}

})();

/**
 * @type {Router}
 */
var router = new Router();

// router.use("/login", require("./routes/login"));
router.use("/admin", require("./routes/admin"));

var server = http.createServer((req, res) => {

	router(req, res, finalhandler(req, res));
	
});

router.get("*", (req, res, next) => {

	var file = path.join(__dirname, "..", "www", req.url === "/" ? "index.html" : req.url);

	if (fs.existsSync(file)) {

		var stat = fs.statSync(file);

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
