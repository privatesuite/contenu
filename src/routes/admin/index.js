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

	if (!fs.existsSync(file)) {

		res.writeHead(404);
		
		res.end("404: Not Found");

		return;

	}

	var stat = fs.statSync(file);

	res.writeHead(200, {

		"Content-Type": "application/octet-stream",
		"Content-Length": stat.size

	});

	fs.createReadStream(file).pipe(res);

});

router.post("/login", async (req, res) => {

	const data = await body(req);
	const users = await db.users();

	const u = users.find(_ => _.username === data.username && _.password === sha512.sha512(data.password));

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

	} else {

		const user = (await db.users()).find(_ => _.id === session.has(req).user_id);
		
		if (user && (user.perm_type === "author" || user.perm_type === "admin")) next();
		else {

			res.writeHead(200, {
		
				"Content-Type": "text/html"
		
			});
		
			res.end(await view(req, "login/index", {}));

		}

	}

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

	const data = await body(req);

	if (typeof data.repo === "string" && typeof data.branch === "string") {

		await clone(data.repo, data.branch);

		res.writeHead(302, {

			"Location": "/admin/source"
			
		});

	} else {



	}

	res.end();

});

router.get("/elements", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	res.end(await view(req, "admin/elements", {}));

});

router.get("/settings", async (req, res) => {

	res.writeHead(200, {

		"Content-Type": "text/html"
		
	});

	res.end(await view(req, "admin/settings", {}));

});

router.use("/data", require("./data"));
router.use("/plugins", require("./plugins"));

module.exports = router;
