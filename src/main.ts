import request = require("request");
import * as fs from "fs";
import {StorePage} from "./interfaces";


function getItems(): Promise<StorePage> {
	return new Promise((resolve) => {
		request("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json", (err, res, body) => {
			resolve(JSON.parse(body) as StorePage);
		});
	});
}

async function run() {
	const items =  await getItems();

	for (const app of items.applist.apps) {
		console.log(app.name);
	}
}


run().then(() => {
	console.log("done");
});