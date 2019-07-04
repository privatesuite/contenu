const fs = require("fs");
const ini = require("ini");
const path = require("path");

var current;

module.exports = name => {
	
	if (name) current = name;
	return ini.parse(fs.readFileSync(path.join(__dirname, "..", "..", `config/${current || name}.conf`)).toString());

}
