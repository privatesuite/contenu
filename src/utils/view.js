const fs = require("fs");
const ejs = require("ejs");
const session = require("../utils/session");
const Database = require("../db");

var db = new Database();

module.exports = (request, name, data) => {

	return new Promise(async (resolve, reject) => {

		ejs.renderFile(`views/${name}.ejs`, {

			current_user: (await db.users()).find(_ => _.id === session.has(request).user_id),

			users: await db.users(),

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
