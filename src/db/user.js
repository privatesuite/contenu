const Database = require("./index");

module.exports = class User {

	/**
	 * @param {Database} db The element's db
	 * @param {string} id The user's id (e.g: rth21xp24gc24)
	 * @param {string} username The user's username (e.g: aurame, IndyAdvant)
	 * @param {string} email The user's email (e.g: john@ce.na)
	 * @param {string} password The user's password (e.g: vERy_SeCuRE_Pa$$W0rd)
	 * @param {"viewer"|"author"|"admin"} perm_type The user type
	 * @param {object} fields The data associated with the element
	 */
	constructor (db, id, username, email, password, perm_type, fields) {

		this.db = db;
		this.id = id || Math.random().toString(36).replace("0.", "");
		this.username = username;
		this.email = email;
		this.password = password;
		this.perm_type = perm_type;
		this.fields = fields;

	}

	sync () {

		this.db.db().update({

			type: "user",
			id: this.id

		}, {

			type: "user",
			id: this.id,
			username: this.username,
			email: this.email,
			password: this.password,
			perm_type: this.perm_type,
			fields: this.fields

		});

	}

}
