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

	give (user_id, response) {

		const token = jwt.sign({

			user_id

		}, conf.admin.secret);

		cookies.set("token", token, "/admin", response);

	}

}
