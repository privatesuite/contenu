const Database = require("./index");

module.exports = class Element {
	
	/**
	 * @param {Database} db The element's db
	 * @param {string} id The element's unique identifier (e.g: a slug)
	 * @param {string} template The element's template. The template defines the fields of all its children elements
	 * @param {object} fields The data associated with the element
	 */
	constructor (db, id, template, fields) {

		this.db = db;
		this.id = id || Math.random().toString(36).replace("0.", "");
		this.template = template;
		this.fields = fields;

	}

	sync () {

		this.db.db().update({

			type: "element",
			id: this.id

		}, {

			template: this.template,
			fields: this.fields

		});

	}

}
