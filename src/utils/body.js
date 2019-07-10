const qs = require("querystring");
const multiparty = require("multiparty");
const WritableStreamBuffer = require("stream-buffers").WritableStreamBuffer;

function trim (string) {

	return string.trim().replace(/\0/g, "");
	
}

function trimStart (buffer) {

	let pos = 0;
	
	for (let i = 0; i <= buffer.length; i++) {

		if (buffer[i] !== 0x00) {
		
			pos = i;
			break;
		
		}

	}

	return buffer.slice(pos);

}

function parseMultipart (request) {

	return new Promise((resolve, reject) => {

		let form = new multiparty.Form({

			

		});

		let out = {};

		form.parse(request);

		form.on("field", (name, value) => {

			out[name] = value;

		});

		form.on("part", part => {

			let writeStream = new WritableStreamBuffer();

			part.on("data", chunk => {
			
				// console.log(chunk)
				writeStream.write(chunk);
			
			});
			
			part.on("end", chunk => {
		
				writeStream.end(chunk);

				var contents = writeStream.getContents();

				if (!contents) return;

				if (!out[part.name]) out[part.name] = [];

				out[part.name].push({

					name: part.name,
					filename: part.filename,
					data: contents

				});

			});

			part.on("error", err => {throw err;})

		});

		form.on("error", err => {throw err;})
		form.on("close", () => resolve(out));

	});

}

module.exports = async r => {

	if (r.headers["content-type"].startsWith("multipart/form-data")) return await parseMultipart(r);

	const b = await (new Promise(_ => {

		let _b = Buffer.from([]);
		
		r.on("data", __ => _b = Buffer.concat([_b, __]));
		r.on("end", __ => _(_b));

	}));

	if (r.headers["content-type"] === "application/x-www-form-urlencoded") return qs.parse(b.toString());

}
