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

router.get("/file/:file", async (req, res) => {

	if (fs.existsSync(path.join(__dirname, "..", "..", "..", "files", req.params.file))) {

		res.writeHead(200, {
			
			"Content-Type": "application/octet-stream"

		});

		fs.createReadStream(path.join(__dirname, "..", "..", "..", "files", req.params.file)).pipe(res);

	} else {

		res.end("Invalid File");

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

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	res.end(JSON.stringify(
		(await db.elements()).filter(_ => _.fields.api_access).map(_ => {_.db = undefined; return _;})
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

module.exports = router;
