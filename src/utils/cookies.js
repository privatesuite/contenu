module.exports = {

	parse (request) {
		
		var list = {},
			rc = request.headers.cookie;
	
		rc && rc.split(";").forEach(cookie => {

			var parts = cookie.split("=");
			list[parts.shift().trim()] = decodeURIComponent(parts.join("="));

		});
	
		return list;
	
	},

	set (name, data, path, response) {

		response.setHeader("Set-Cookie", `${name}=${encodeURIComponent(data)}; Path=${path}`);

	}

}
