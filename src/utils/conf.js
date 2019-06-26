const fs = require("fs");
const ini = require("ini");

var current;

module.exports = name => {
	
	if (name) current = name;
	return ini.parse(fs.readFileSync(`config/${current || name}.conf`).toString());

}
