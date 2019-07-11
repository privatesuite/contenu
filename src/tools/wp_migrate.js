const xml2js = require("xml2js");
const Database = require("../db");

let db = new Database();
const Element = require("../db/element");

function parseXML (xml) {

	return new Promise((resolve, reject) => xml2js.parseString(xml, (err, result) => err ? resolve() : resolve(result)));

}

module.exports = async (xml, map_posts, map_pages) => {

	xml = await parseXML(xml);

	if (!xml || !xml.rss || !Array.isArray(xml.rss.channel)) return;
	xml = xml.rss.channel[0];
	
	for (const item of xml.item) {

		// console.log(item["wp:post_type"])

		if (item["wp:postmeta"] && item["content:encoded"] && !!item["content:encoded"][0] && ["post", "page"].indexOf(item["wp:post_type"][0]) !== -1) {

			let type = item["wp:post_type"][0];

			if (type === "page") {

				var fields = {

					title: item.title[0],
					content: item["content:encoded"][0],
					api_access: true,
					link: item.link[0]

				}

				if (fields.content.indexOf("<!-- wp:latest-posts") !== -1) {

					continue;

				}

				// console.log("Write page!");
				await db.addElement(new Element(db, Math.random().toString(36).replace("0.", ""), map_pages, fields));
				// console.log(db.elements())

			} else {

				var fields = {

					title: item.title[0],
					author: item["dc:creator"][0],
					content: item["content:encoded"][0],
					api_access: true,
					link: item.link[0],
					category: item.category.map(_ => _._.toLowerCase()).join(", ")

				}

				// console.log("Write post!")
				await db.addElement(new Element(db, Math.random().toString(36).replace("0.", ""), map_posts, fields));

			}

		}

	}

}
