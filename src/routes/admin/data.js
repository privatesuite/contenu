const fs = require("fs");
const path = require("path");
const Router = require("router");

const body = require("../../utils/body");
const view = require("../../utils/view");

const wp_migrate = require("../../tools/wp_migrate");

var router = new Router();

router.get("/", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	res.end(await view(req, "admin/data", {}));

});

router.post("/import", async (req, res) => {

	var data = await body(req);

	if (data.file && data.file.filename) {

		await wp_migrate(data.file.data);

		res.writeHead(302, {
		
	 		"Location": "/admin/data"
	
		});
	
		res.end();

	} else {

		res.end();

	}

});

module.exports = router;
