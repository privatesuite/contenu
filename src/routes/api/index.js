const fs = require("fs");
const qs = require("querystring");
const url = require("url");
const path = require("path");
const Router = require("router");
const plugins = require("../../plugins");
const Database = require("../../db");

const body = require("../../utils/body");
const sha512 = require("js-sha512");
const session = require("../../utils/session");

var db = new Database();
var router = new Router();

router.use((req, res, next) => {

	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

	next();

});

router.get("/", (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	res.end(JSON.stringify({

		api_version: 1,
		routes: {

			"/api/file/{path}": "GETs a file",
			"/api/users": "GETs all existing users",
			"/api/elements": "GETs all `api_access` elements",
			"/api/templates": "GETs all templates"

		}

	}));

});

router.post("/authenticate", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	const data = await body(req);
	if (!data) {res.end(); return;}

	const users = await db.users();

	const u = users.find(_ => _.username === data.username && _.password === sha512.sha512(data.password));

	if (data.username && data.password && u) {

		res.end(JSON.stringify(session.generateToken(u)));
		
		return;

	}

	res.end(JSON.stringify({

		error: "invalidCredentials",
		message: "Invalid Credentials"

	}));

});

router.get("/file/:file", async (req, res) => {

	if (fs.existsSync(path.join(__dirname, "..", "..", "..", "files", req.params.file))) {

		res.writeHead(200, {
			
			"Content-Type": "application/octet-stream"

		});

		fs.createReadStream(path.join(__dirname, "..", "..", "..", "files", req.params.file)).pipe(res);

	} else {

		res.end(JSON.stringify({
		
			error: "invalidFile",
			message: "Invalid File"
		
		}));

	}

});

router.get("/users", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	res.end(JSON.stringify(
		(await db.users()).map(_ => {_.db = undefined; _.email = undefined; _.password = undefined; return _;})
	));

});

router.get("/elements", async (req, res) => {

	var isAdmin = false;

	req.params = qs.parse((url.parse(req.url).search || "").replace("?", ""));

	if (req.params && req.params.token) {

		const user = (await db.users()).find(_ => _.id === session.parseSession(req.params.token).user_id);
		
		if (user && (user.perm_type === "author" || user.perm_type === "admin")) isAdmin = true;

	}

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	res.end(JSON.stringify(
		(await db.elements()).filter(_ => _.fields.api_access || isAdmin).map(_ => {_.db = undefined; return _;})
	));

});

router.get("/templates", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	res.end(JSON.stringify(
		(await db.templates()).map(_ => {_.db = undefined; return _;})
	));

});

router.get("/plugins", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	req.params = qs.parse((url.parse(req.url).search || "").replace("?", ""));

	if (req.params && req.params.token) {

		const user = (await db.users()).find(_ => _.id === session.parseSession(req.params.token).user_id);
		
		if (user && (user.perm_type === "author" || user.perm_type === "admin")) {

			const p = plugins.getPlugins().map(_ => {
				
				return {

					folder: _.folder,
					package: _.package()

				}

			});

			res.end(JSON.stringify(p));

		} else {

			res.end(JSON.stringify({

				error: "invalidUser",
				message: "Invalid user"
		
			}));

		}

	} else res.end(JSON.stringify({

		error: "tokenMissing",
		message: "Missing token"

	}));

});

module.exports = router;
