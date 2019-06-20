import {ItemList} from "./interfaces";
import request = require("request");

export function getItems(): Promise<ItemList> {
	return new Promise((resolve) => {
		request("http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json", (err, res, body) => {
			let items = JSON.parse(body) as ItemList;
			items.applist.apps = items.applist.apps.sort((a, b) => a.appid - b.appid);
			resolve(items);
		});
	});
}

export function sleep(ms){
	return new Promise(resolve=>{
		setTimeout(resolve,ms)
	})
}