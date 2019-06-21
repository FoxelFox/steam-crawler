import {ItemList} from "./interfaces";
import request = require("request");
import * as fs from "fs";

export function getItems(includeLocal?: boolean): Promise<ItemList> {
	return new Promise((resolve) => {
		request("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json", (err, res, body) => {
			let items = JSON.parse(body) as ItemList;

			if (includeLocal) {
				let list = fs.readdirSync("crawled");

				for (const id of list) {
					const i = parseInt(id);

					if (isNaN(i)) {
						continue;
					}

					let alreadyAssigned = false;
					for (const app of items.applist.apps) {
						if (app.appid === i) {
							alreadyAssigned = true;
							break;
						}
					}
					if (!alreadyAssigned) {
						items.applist.apps.push({appid: i, name: "// TODO: fix this name"});
					}

				}

			}

			items.applist.apps = items.applist.apps.sort((a, b) => a.appid - b.appid);

			console.log("items finished")
			resolve(items);
		});
	});
}

export function sleep(ms){
	return new Promise(resolve=>{
		setTimeout(resolve,ms)
	})
}