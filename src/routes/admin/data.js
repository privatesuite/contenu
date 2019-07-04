const fs = require("fs");
const path = require("path");
const Router = require("router");
const sha512 = require("js-sha512");
const Database = require("../../db");

var db = new Database();
const User = require("../../db/user");

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

router.get("/edit_user/:id", async (req, res) => {

	var id = req.params.id;
	var user = (await db.users()).find(_ => _.id === id);

	if (id !== "new" && !user) {

		res.writeHead(302, {
		
			"Location": "/admin/data"

		});

		res.end();
		
		return;

	}

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	res.end(await view(req, "admin/edit_user", {

		user: id === "new" ? {

			id: Math.random().toString(36).replace("0.", ""),
			username: "new_user",
			email: "new@us.er",
			perm_type: "viewer"

		} : user

	}));

});

router.post("/edit_user/:id", async (req, res) => {

	var id = req.params.id;
	var user = (await db.users()).find(_ => _.id === id);
	var data = await body(req);

	if (id !== "new" && !user) {

		res.writeHead(302, {
		
			"Location": "/admin/data"

		});

		res.end();
	
		return;

	}

	if ((data.username && data.email && ["viewer", "author", "admin"].indexOf(data.perm_type) !== -1)) {

		if (id === "new" && (await db.users()).find(_ => _.username === data.username)) return;
		if (id === "new") {

			db.addUser(new User(db, data.id, data.username, data.email, sha512.sha512(data.password), data.perm_type, {}));

		} else {

			user.username = data.username;
			user.email = data.email;
			user.perm_type = data.perm_type;
			
			if (data.password) {

				user.password = sha512.sha512(data.password);

			}

			user.sync();

		}

	}

	res.writeHead(302, {
		
		"Location": "/admin/data"

	});

	res.end();

});

module.exports = router;
