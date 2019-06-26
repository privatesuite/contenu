const fs = require("fs");
const path = require("path");
const Router = require("router");
const Database = require("../../db");

const body = require("../../utils/body");
const view = require("../../utils/view");
const clone = require("../../utils/clone");
const sha512 = require("js-sha512");
const session = require("../../utils/session");

var db = new Database();
var router = new Router();

router.get("/static/*", async (req, res) => {

	var file = path.join(__dirname, "../../..", req.url);
	var stat = fs.statSync(file);

	res.writeHead(200, {

		"Content-Type": "application/octet-stream",
		"Content-Length": stat.size

	});

	fs.createReadStream(file).pipe(res);

});

router.post("/login", async (req, res) => {

	var data = await body(req);
	var users = await db.users();

	var u = users.find(_ => _.username === data.username && _.password === sha512.sha512(data.password));

	if (data.username && data.password && u) {

		session.give(u.id, res);

	}

	res.writeHead(302, {
		
		"Location": "/admin"

	});

	res.end();

});

router.use(async (req, res, next) => {

	if (!session.has(req)) {

		res.writeHead(200, {
		
			"Content-Type": "text/html"
	
		});
	
		res.end(await view(req, "login/index", {}));

	} else next();

});

router.get("/", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	res.end(await view(req, "admin/dashboard", {}));

});

router.get("/source", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	res.end(await view(req, "admin/source", {}));

});

router.post("/source/clone", async (req, res) => {

	var data = await body(req);

	if (typeof data.repo === "string" && typeof data.branch === "string") {

		await clone(data.repo, data.branch);

		res.writeHead(302, {

			"Location": "/admin/source"
			
		});

	} else {



	}

	res.end();

});

router.use("/data", require("./data"));

module.exports = router;