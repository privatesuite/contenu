const fs = require("fs");
const ejs = require("ejs");
const session = require("../utils/session");
const Database = require("../db");
const path = require("path");

const db = new Database();

module.exports = (request, name, data) => {

	return new Promise(async (resolve, reject) => {

		ejs.renderFile(path.join(__dirname, `../..`, `views`, `${name}.ejs`), {

			current_user: (await db.users()).find(_ => _.id === session.has(request).user_id),

			users: await db.users(),
			elements: await db.elements(),
			templates: await db.templates(),

			...data

		}, (err, out) => {

			if (err) {

				reject(err);
				return;

			}

			resolve(out);

		});

	});

}
