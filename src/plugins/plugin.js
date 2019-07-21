const fs = require("fs");
const vm2 = require("vm2");
const path = require("path");

const Database = require("../db");
const User = require("../db/user");
const Element = require("../db/element");
const Template = require("../db/template");

// const contenu = {

// 	database: new Database(),

// 	User,
// 	Element,
// 	Template,

// 	routes: {

// 		api: require("../routes/api"),
// 		data: require("../routes/admin/data"),
// 		admin: require("../routes/admin"),

// 	},

// 	tools: {

// 		wp_migrate: require("../tools/wp_migrate")

// 	},

// 	utils: {

// 		body: require("../utils/body"),
// 		clone: require("../utils/clone"),
// 		conf: require("../utils/conf"),
// 		cookies: require("../utils/cookies"),
// 		session: require("../utils/session"),
// 		view: require("../utils/view")

// 	}

// }

class Plugin {

	constructor (folder) {

		this.vm;
		this.folder = folder;

		this.cache = {};

	}

	package () {

		var t = this;

		function _ () {

			if (fs.existsSync(path.join(t.folder, "package.json"))) {

				return JSON.parse(fs.readFileSync(path.join(t.folder, "package.json")));
	
			} else {
	
				return {
	
					name: path.parse(t.folder).name,
					main: "index.js"
	
				}
	
			}

		}

		return this.cache["package"] || (this.cache["package"] = _());

	}

	html_description () {

		var t = this;

		function _ () {

			if (fs.existsSync(path.join(t.folder, "plugin.html"))) {

				return fs.readFileSync(path.join(t.folder, "plugin.html"));
	
			} else {
	
				return "<i>No Description</i>";
	
			}

		}

		return this.cache["html_description"] || (this.cache["html_description"] = _());

	}

	start () {

		this.vm = new vm2.NodeVM({
		
			console: "inherit",
			sandbox: {},
			require: {

				external: true,
				builtin: ["*"],
				root: this.folder,
				context: "sandbox",
				mock: {

					contenu: {

						database: new Database(),
					
						User,
						Element,
						Template,
					
						routes: {
					
							api: require("../routes/api"),
							data: require("../routes/admin/data"),
							admin: require("../routes/admin"),
					
						},
					
						tools: {
					
							wp_migrate: require("../tools/wp_migrate")
					
						},
					
						utils: {
					
							body: require("../utils/body"),
							clone: require("../utils/clone"),
							conf: require("../utils/conf"),
							cookies: require("../utils/cookies"),
							session: require("../utils/session"),
							view: require("../utils/view")
					
						},

						Router: require("router")
					
					}

				}

			}

		});

		var main = path.join(this.folder, this.package().main);

		this.vm.run(fs.readFileSync(main).toString(), main);

	}

}

module.exports = Plugin;
