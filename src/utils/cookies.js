module.exports = {

	parse (request) {
		
		let list = {},
			rc = request.headers.cookie;
	
		rc && rc.split(";").forEach(cookie => {

			let parts = cookie.split("=");
			list[parts.shift().trim()] = decodeURIComponent(parts.join("="));

		});
	
		return list;
	
	},

	set (name, data, path, response) {

		response.setHeader("Set-Cookie", `${name}=${encodeURIComponent(data)}; Path=${path}`);

	}

}
