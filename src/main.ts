import request = require("request");
import clear = require("clear");
import {ItemList} from "./interfaces";
import * as fs from "fs";

let items: ItemList;


function getItems(): Promise<ItemList> {
	return new Promise((resolve) => {
		request("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json", (err, res, body) => {
			resolve(JSON.parse(body) as ItemList);
		});
	});
}


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

		items =  await getItems();

		if (!fs.existsSync("crawled")) {
			fs.mkdirSync("crawled");
		}


		const count = items.applist.apps.length;
		let i = 0;


		const join = () => {
			clear();

			console.log(++i, 'of', count, 'items', (++i / count * 100).toFixed(2) + "%");

			if (i === count) {
				resolve();
			}
		};

		for (const app of items.applist.apps) {

			const appFileName = "crawled" + "/" + app.appid + "/" + fileName + ".jpg";
			const appFolderName = "crawled" + "/" + app.appid.toString();

			if (!fs.existsSync(appFolderName)) {
				fs.mkdirSync(appFolderName);
			}

			if (!fs.existsSync(appFileName)) {
				const body = await fetch(path.replace("{id}", app.appid.toString()));

				fs.writeFile(appFileName, body, "binary", () => {
					join();
				});
			} else {
				join();
			}
		}
	});
}


crawl(
	"https://steamcdn-a.akamaihd.net/steam/apps/{id}/header.jpg",
	"header"
).then(() => {
	console.log("done");
});