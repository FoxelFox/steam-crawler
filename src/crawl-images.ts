import request = require("request");
import clear = require("clear");
import {ItemList} from "./interfaces";
import * as fs from "fs";
import {getItems, sleep} from "./utils";

let items: ItemList;
let error = 0;
let created = 0;

function fetch(path) {
	return new Promise((resolve, reject) => {
		request(path, {encoding: "binary"}, (err, res, body) => {
			if (err) {
				reject(err);
			} else {
				resolve(body);
			}
		});
	});
}



function crawl(path: string, fileName: string) {
	return new Promise(async (resolve) => {

		items =  await getItems(true);

		if (!fs.existsSync("crawled")) {
			fs.mkdirSync("crawled");
		}


		const count = items.applist.apps.length;
		let i = 0;


		const join = () => {
			clear();

			++i;
			console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%", "created", created, "errors", error);

			if (i === count) {
				resolve();
			}
		};

		let parallelDownloads = 0;

		for (const app of items.applist.apps) {

			const appFileName = "crawled" + "/" + app.appid + "/" + fileName + ".jpg";
			const appFolderName = "crawled" + "/" + app.appid.toString();

			if (!fs.existsSync(appFolderName)) {
				fs.mkdirSync(appFolderName);
			}



			if (!fs.existsSync(appFileName)) {

				try {

					while (parallelDownloads > 30) {
						await sleep(1)
					}

					parallelDownloads++;
					fetch(path.replace("{id}", app.appid.toString())).then((body) => {
						fs.writeFile(appFileName, body, "binary", () => {
							parallelDownloads--;
							created++;
							join();
						});
					});
				} catch (e) {
					error++;
				}


			} else {
				join();
			}
		}
	});
}



crawl(
	"https://steamcdn-a.akamaihd.net/steam/apps/{id}/" + process.argv[2] + ".jpg",
	process.argv[2]
).then(() => {
	console.log("done");
});