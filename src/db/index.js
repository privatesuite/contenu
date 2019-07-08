const path = require("path");
const Datastore = require("nedb");

const User = require("./user");
const Element = require("./element");
const Template = require("./template");

var db = new Datastore({
	
	filename: path.join(__dirname, "..", "..", "database"),
	autoload: true

});

module.exports = class Database {

	db () {return db;}

	/**
	 * Get all users present in the database
	 * 
	 * @returns {Promise<User[]>}
	 */
	users () {
		
		return new Promise((resolve, reject) => {

			db.find({

				type: "user"
				
			}, (err, docs) => {

				if (err) {

					reject(err);
					return;

				}

				var users = [];

				for (const doc of docs) {
				
					users.push(new User(this, doc.id, doc.username, doc.email, doc.password, doc.perm_type, doc.fields));
					
				}

				resolve(users);

			});

		}); 

	}

	/**
	 * Add a user to the database
	 * 
	 * @param {User} user 
	 * 
	 * @returns {Promise<this>}
	 */
	addUser (user) {

		return new Promise((resolve, reject) => {

			db.insert({

				type: "user",

				id: user.id,
				username: user.username,
				email: user.email,
				password: user.password,
				perm_type: user.perm_type,
				fields: user.fields

			}, (err) => {

				if (err) {

					reject(err);
					return;

				}

				resolve(this);

			});

		});

	}

	/**
	 * Get all elements present in the database
	 * 
	 * @returns {Promise<Element[]>}
	 */
	elements () {

		return new Promise((resolve, reject) => {

			db.find({

				type: "element"
				
			}, (err, docs) => {

				if (err) {

					reject(err);
					return;

				}

				var elements = [];

				for (const doc of docs) {
				
					elements.push(new Element(this, doc.id, doc.template, doc.fields));
					
				}

				resolve(elements);

			});

		});

	}

	/**
	 * Add an element to the database
	 * 
	 * @param {Element} element 
	 * 
	 * @returns {Promise<this>}
	 */
	addElement (element) {

		return new Promise((resolve, reject) => {

			db.insert({

				type: "element",

				id: element.id,
				template: element.template,
				fields: element.fields

			}, (err) => {

				if (err) {

					reject(err);
					return;

				}

				resolve(this);

			});

		});

	}

	/**
	 * Get all templates present in the database
	 * 
	 * @returns {Promise<Template[]>}
	 */
	templates () {

		return new Promise((resolve, reject) => {

			db.find({

				type: "template"
				
			}, (err, docs) => {

				if (err) {

					reject(err);
					return;

				}

				var templates = [];

				for (const doc of docs) {
				
					templates.push(new Template(this, doc.id, doc.name, doc.fields));
					
				}

				resolve(templates);

			});

		});

	}

	/**
	 * Add a template to the database
	 * 
	 * @param {Template} template 
	 * 
	 * @returns {Promise<this>}
	 */
	addTemplate (template) {

		return new Promise((resolve, reject) => {

			db.insert({

				type: "template",

				id: template.id,
				name: template.name,
				fields: template.fields

			}, (err) => {

				if (err) {

					reject(err);
					return;

				}

				resolve(this);

			});

		});

	}

}
