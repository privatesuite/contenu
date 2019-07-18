const fs = require("fs");
const ejs = require("ejs");
const session = require("../utils/session");
const Database = require("../db");
const mime = require("mime");
const path = require("path");

const db = new Database();

var f = module.exports = (request, name, data = {}, folder = path.join(__dirname, `../..`, `views`)) => {

	return new Promise(async (resolve, reject) => {

		ejs.renderFile(path.join(folder, `${name}.ejs`), {

			request,
			current_user: (await db.users()).find(_ => _.id === session.has(request).user_id),

			users: await db.users(),
			elements: await db.elements(),
			templates: await db.templates(),
			files: fs.readdirSync(path.join(__dirname, "..", "..", "files")),
			
			mime,

			view: f,
			folder,

			...data

		}, {
			
			async: true
		
		}, (err, out) => {

			if (err) {

				reject(err);
				return;

			}

			resolve(out);

		});

	});

}
