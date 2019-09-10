const fs = require("fs");
const vm2 = require("vm2");
const path = require("path");
const http = require("http");
const mime = require("mime");
const Router = require("router");

const reqPath = require("../utils/req_path");

let wwwSrc;
const wwwFolder = path.join(__dirname, "..", "..", "www");

async function wwwRun (req, res, code = wwwSrc, other) {

	let methods = {};
	let complete = false;

	return new Promise((resolve, reject) => {

		for (const method of http.METHODS.map(_ => _.toLowerCase())) {
		
			methods[method] = (route, handler) => {
	
				if (complete) return;
	
				let match = reqPath(route, req.url);
				
				if (match) {
	
					complete = true;
	
					res.file = file => other.file(path.join(wwwFolder, file));
					handler(req, res);
					resolve({  });
	
				}
	
			}
	
		}

		new vm2.VM({

			sandbox: {
	
				auto (routes) {

					if (typeof route === "string") routes = [routes];

					for (const route of routes) {
					
						let match = reqPath(route, req.url);

						if (match) {

							complete = true;
							resolve({ auto: true });
							return;

						}
						
					}
				
				},
				
				...methods				
				
			}
		
		}).run(code);

		setTimeout(() => {

			if (!complete) resolve({ ignore: true });

		}, 10);

	});

}

const router = new Router();

router.all("*", async (req, res, next) => {

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");

	let file = path.join(wwwFolder, req.url === "/" ? "index.html" : req.url);

	if (wwwSrc || fs.existsSync(file)) {

		function _ (_file = file) {

			const stat = fs.statSync(_file);

			res.writeHead(200, {

				"Content-Type": mime.getType(_file) || "application/octet-stream",
				"Content-Length": stat.size

			});

			fs.createReadStream(_file).pipe(res);

		}

		if (!wwwSrc) _(); else {

			const out = await wwwRun(req, res, wwwSrc, {

				file: _

			});

			if (out.auto) {

				if (fs.existsSync(file)) _();
				else {

					next();
					return;

				}

			} else if (out.ignore) {

				next();
				return;

			}

		}

	} else {

		next();

	}

});

module.exports = router;
module.exports.sync = () => wwwSrc = (fs.existsSync(path.join(wwwFolder, "www.js")) ? fs.readFileSync(path.join(wwwFolder, "www.js")).toString() : undefined);
