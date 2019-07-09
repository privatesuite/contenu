const qs = require("querystring");

function parseMultipart (request, data) {

	let out = {};
	const lines = data.trim().split("\n").map(d => d.trim()).filter(d => !!d);
	const boundary = request.headers["content-type"].split("boundary=")[1].trim().replace(";", "");

	let hold = {};

	for (const line of lines) {
		
		if (line === `--${boundary}` || line === `--${boundary}--`) {

			if (hold.name) {
				hold.data = hold.data.trim();
				out[hold.name] = hold;
			}

			hold = {data: ""};

		} if (line === `--${boundary}--`) return out;
		else {

			if (line.startsWith("Content-Disposition: form-data;")) {

				let disposition = {};
				const _disposition = line.replace("Content-Disposition: form-data;", "").trim();

				_disposition = _disposition.split("; ");

				_disposition.map(d => disposition[d.split("=")[0]] = d.split("=")[1].substring(1, d.split("=")[1].length - 1));

				hold.name = disposition.name;
				if (disposition.filename) hold.filename = disposition.filename;

			} else if (line.startsWith("Content-Type")) {

				hold.type = line.replace("Content-Type:", "").trim();

			} else if (!(line === `--${boundary}` || line === `--${boundary}--`)) {

				hold.data += line + "\n";

			}

		}

	}

	return out;
	
}

module.exports = async r => {

	const b = await (new Promise(_ => {

		let _b = "";
		
		r.on("data", __ => _b += __);
		r.on("end", __ => _(_b));

	}));

	if (r.headers["content-type"] === "application/x-www-form-urlencoded") return qs.parse(b);
	else if (r.headers["content-type"].startsWith("multipart/form-data")) return parseMultipart(r, b);

}
