import {getItems} from "./utils";
import request = require("request");
import * as fs from "fs";
import clear = require("clear");

let items;


function getIndex(id) {

	return new Promise(async (resolve, reject) => {
		request("https://store.steampowered.com/app/" + id, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
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

	const count = items.applist.apps.length;
	let i = 0;

	for (const app of items.applist.apps) {

		const appFileName = "crawled" + "/" + app.appid + "/index.html";
		const appFolderName = "crawled" + "/" + app.appid.toString();

		if (!fs.existsSync(appFolderName)) {
			fs.mkdirSync(appFolderName);
		}


		if (!fs.existsSync(appFileName)) {
			try {
				const index = await getIndex(app.appid);
				fs.writeFileSync(appFileName, index);
			} catch (e) {
				console.log(e);
				break;
			}
		}

		clear();

		++i;
		console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%");

	}
}


run().then(() => {
	console.log("done");
});