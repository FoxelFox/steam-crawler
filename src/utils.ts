import {ItemList} from "./interfaces";
import request = require("request");

export function getItems(): Promise<ItemList> {
	return new Promise((resolve) => {
		request("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json", (err, res, body) => {
			resolve(JSON.parse(body) as ItemList);
		});
	});
}