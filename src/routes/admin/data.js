const fs = require("fs");
const url = require("url");
const path = require("path");
const Router = require("router");
const sha512 = require("js-sha512");
const Database = require("../../db");

let db = new Database();
const User = require("../../db/user");
const Element = require("../../db/element");
const Template = require("../../db/template");

const body = require("../../utils/body");
const view = require("../../utils/view");

const wp_migrate = require("../../tools/wp_migrate");

const router = new Router();

router.get("/", async (req, res) => {

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	res.end(await view(req, "admin/data", {}));

});

router.post("/import", async (req, res) => {

	const data = await body(req);

	if (data.file && data.file[0] && data.file[0].filename && data.map_posts && data.map_pages) {

		await wp_migrate(data.file[0].data.toString(), data.map_posts, data.map_pages);

		res.writeHead(302, {
		
			"Location": "/admin/data"
	
		});
	
		res.end();

	} else {

		res.writeHead(302, {
		
			"Location": "/admin/data"
	
		});

		res.end();

	}

});

router.get("/edit_user/:id", async (req, res) => {

	const id = req.params.id;
	const user = (await db.users()).find(_ => _.id === id);

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

	const id = req.params.id;
	const user = (await db.users()).find(_ => _.id === id);
	const data = await body(req);

	if (user && url.parse(req.url).query === "delete") {

		user.delete();

	}

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

router.get("/edit_element/:id", async (req, res) => {

	const id = req.params.id;
	const element = (await db.elements()).find(_ => _.id === id);

	if (id !== "new" && !element) {

		res.writeHead(302, {
		
			"Location": "/admin/elements"

		});

		res.end();
		
		return;

	}

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	// if (element) element.fields = JSON.stringify(element.fields);

	res.end(await view(req, "admin/edit_element", {

		element: id === "new" ? {

			id: Math.random().toString(36).replace("0.", ""),
			
			template: "",
			fields: {}

		} : element

	}));

});

router.post("/edit_element/:id", async (req, res) => {

	const id = req.params.id;
	const element = (await db.elements()).find(_ => _.id === id);
	const data = await body(req);

	if (element && url.parse(req.url).query === "delete") {

		element.delete();

	}

	if (data.fields) data.fields = JSON.parse(data.fields);

	if (id !== "new" && !element) {

		res.writeHead(302, {
		
			"Location": `/admin/elements?to=${id}`

		});

		res.end();
	
		return;

	}

	if (data.template !== undefined && data.fields) {

		if (id === "new") {

			db.addElement(new Element(db, data.id, data.template, data.fields || {}));

		} else {

			element.template = data.template;
			element.fields = data.fields || {};

			element.sync();

		}

	}

	res.writeHead(302, {
		
		"Location": `/admin/elements?to=${id}`

	});

	res.end();

});

router.get("/edit_template/:id", async (req, res) => {

	const id = req.params.id;
	const template = (await db.templates()).find(_ => _.id === id);

	if (id !== "new" && !template) {

		res.writeHead(302, {
		
			"Location": "/admin/data"

		});

		res.end();
		
		return;

	}

	res.writeHead(200, {
		
		"Content-Type": "text/html"

	});

	// if (element) element.fields = JSON.stringify(element.fields);

	res.end(await view(req, "admin/edit_template", {

		template: id === "new" ? {

			id: Math.random().toString(36).replace("0.", ""),
			
			name: "New Template",
			fields: {}

		} : template

	}));

});

router.post("/edit_template/:id", async (req, res) => {

	const id = req.params.id;
	const template = (await db.templates()).find(_ => _.id === id);
	const data = await body(req);

	if (template && url.parse(req.url).query === "delete") {

		template.delete();

	}

	if (data.fields) data.fields = JSON.parse(data.fields);

	if (id !== "new" && !template) {

		res.writeHead(302, {
		
			"Location": "/admin/data"

		});

		res.end();
	
		return;

	}

	if (data.name !== undefined && data.fields) {

		if (id === "new") {

			db.addTemplate(new Template(db, data.id, data.name, data.fields || {}));

		} else {

			template.name = data.name;
			template.fields = data.fields || {};

			template.sync();

		}

	}

	res.writeHead(302, {
		
		"Location": "/admin/data"

	});

	res.end();

});

router.post("/upload_file", async (req, res) => {

	const data = await body(req);

	if (!data.file) {

		res.writeHead(302, {
		
			"Location": "/admin/data"
	
		});

		res.end();

		return;

	}

	data.file = data.file[0];

	if (data.file && data.file.filename) {

		data.file.filename = data.file.filename.replace(/\.\./g, "");

		// console.log(path.join(__dirname, "..", "..", "..", "files", data.file.filename));
		fs.writeFileSync(path.join(__dirname, "..", "..", "..", "files", data.file.filename), data.file.data);

		res.writeHead(302, {
		
			"Location": "/admin/data?to=files"
	
		});
	
		res.end();

	} else {

		res.writeHead(302, {
		
			"Location": "/admin/data"
	
		});

		res.end();

	}

});

router.post("/delete_file", async (req, res) => {

	const data = await body(req);

	if (data.file) {

		data.file = data.file.replace(/\.\./g, "");

		fs.unlinkSync(path.join(__dirname, "..", "..", "..", "files", data.file));

		res.writeHead(302, {
		
			"Location": "/admin/data?to=files"
	
		});
	
		res.end();

	} else {

		res.writeHead(302, {
		
			"Location": "/admin/data"
	
		});

		res.end();

	}

});

router.post("/rename_file", async (req, res) => {

	const data = await body(req);

	if (data.file) {

		data.file = data.file.replace(/\.\./g, "");

		fs.renameSync(path.join(__dirname, "..", "..", "..", "files", data.file), path.join(__dirname, "..", "..", "..", "files", data.new_name));

		res.writeHead(302, {
		
			"Location": "/admin/data?to=files"
	
		});
	
		res.end();

	} else {

		res.writeHead(302, {
		
			"Location": "/admin/data"
	
		});

		res.end();

	}

});

module.exports = router;
