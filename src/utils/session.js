const jwt = require("jsonwebtoken");
const conf = require("./conf")();
const cookies = require("./cookies");

module.exports = {

	has (request) {

		var c = cookies.parse(request);

		if (c.token) {
		
			try {
			
				return jwt.verify(c.token, conf.admin.secret);

			} catch {

				return false;

			}

		}
		else return false;

	},

	give (user_id, response) {

		var token = jwt.sign({

			user_id

		}, conf.admin.secret);

		cookies.set("token", token, "/admin", response);

	}

}
