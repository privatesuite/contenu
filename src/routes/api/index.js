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

router.get("/", (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "application/json"

	});

	res.end(JSON.stringify({

		api_version: 1,
		routes: {

			"/api/file/{file_name}": "GETs all existing users",
			"/api/users": "GETs all existing users",
			"/api/elements": "GETs all `api_access` elements"

		}

	}));

});

router.get("/file/:file", async (req, res) => {

	

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
		(await db.elements()).filter(_ => _.fields.api_access)
	));

});

module.exports = router;