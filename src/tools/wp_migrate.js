const xml2js = require("xml2js");

function parseXML (xml) {

	return new Promise((resolve, reject) => xml2js.parseString(xml, (err, result) => err ? resolve() : resolve(result)));

}

module.exports = async xml => {
	
	xml = await parseXML(xml);

	if (!xml || !xml.rss || !Array.isArray(xml.rss.channel)) return;
	xml = xml.rss.channel[0];

	for (const item of xml.item) {

		if (item["wp:postmeta"] && item["content:encoded"] && !!item["content:encoded"][0] && ["post", "page"].indexOf(item["wp:post_type"][0]) !== -1) {

			var type = item["wp:post_type"][0];

			console.log(type);

		}

	}

}
