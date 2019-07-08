const Database = require("./index");

module.exports = class Template {
	
	/**
	 * @param {Database} db The template's db
	 * @param {string} id The template's unique identifier (e.g: a slug)
	 * @param {string} name The template's name
	 * @param {object} fields The data associated with the template
	 */
	constructor (db, id, name, fields) {

		this.db = db;
		this.id = id || Math.random().toString(36).replace("0.", "");
		this.name = name;
		this.fields = fields;

	}

	sync () {

		this.db.db().update({

			type: "template",
			id: this.id

		}, {

			type: "template",
			id: this.id,
			name: this.name,
			fields: this.fields

		});

	}

	delete () {

		this.db.db().remove({

			type: "template",
			id: this.id

		});

	}

}
