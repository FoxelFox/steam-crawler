import {getItems} from "./utils";
import request = require("request");
import * as fs from "fs";
import clear = require("clear");

let items;


function getIndex(id) {

	return new Promise(async (resolve, reject) => {
		request("https://store.steampowered.com/app/" + id, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
				"Cookie": request.cookie("lastagecheckage=21-0-1988; birthtime=567039601")
			}
		}, (err, res, body) => {
			if (err) {
				reject(err);
			} {
				resolve(body);
			}

		});
	});


}

async function run() {
	items = await getItems();


	let i = 0;
	let created = 0;
	let error = 0;

	let ids = items.applist.apps.map(i => i.appid);
	if (fs.existsSync("crawled-meta/hidden.json")) {
		ids = ids.concat(fs.readFileSync("crawled-meta/hidden.json").toJSON());
	}

	const count = ids.length;

	for (const id of ids) {

		const appFileName = "crawled" + "/" + id + "/index.html";
		const appFolderName = "crawled" + "/" + id.toString();

		if (!fs.existsSync(appFolderName)) {
			fs.mkdirSync(appFolderName);
		}


		if (!fs.existsSync(appFileName) || process.argv[2] === "force") {
			try {
				const index = await getIndex(id);
				fs.writeFileSync(appFileName, index);
				created++;
			} catch (e) {
				error++;
			}
		}

		clear();

		++i;
		console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%", "created", created, "errors", error);

	}
}

run().then(() => {
	console.log("done");
});