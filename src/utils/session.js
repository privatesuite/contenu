const jwt = require("jsonwebtoken");
const conf = require("./conf")();
const cookies = require("./cookies");

module.exports = {

	parseSession (token) {

		try {
			
			return jwt.verify(token, conf.admin.secret);

		} catch {

			return false;

		}

	},

	has (request) {

		const c = cookies.parse(request);

		if (c.token) {
		
			return this.parseSession(c.token);

		}
		else return false;

	},

	generateToken (user_id) {

		return jwt.sign({

			user_id

		}, conf.admin.secret);

	},

	give (user_id, response) {

		cookies.set("token", this.generateToken(user_id), "/admin", response);

	}

}
