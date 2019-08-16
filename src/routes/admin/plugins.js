const Router = require("router");
const plugins = require("../../plugins");

const view = require("../../utils/view");

var router = new Router();

router.get("/", async (req, res) => {

	res.writeHead(200, {

		"Content-Type": "text/html"
		
	});

	res.end(await view(req, "admin/plugins", {

		plugins: plugins.getPlugins()

	}));

});

module.exports = router;
