import Vibrant = require('node-vibrant');
import {getItems} from "./utils";
import clear = require("clear");
import * as fs from "fs";


const items = {};

async function run() {


	const list = await getItems();
	const count = list.applist.apps.length;
	let appIndex = 0;
	for (const app of list.applist.apps) {
		appIndex++;
		try {
			const palette = await Vibrant.from('crawled/' + app.appid + '/64.jpg').getPalette();
			const colors = palette.Muted.getRgb();

			let colorIndex = 0;
			for (const color of colors) {
				colors[colorIndex] = Math.floor(color);
				colorIndex++;
			}

			items[app.appid] = {
				name: app.name,
				color: colors
			};

			clear();
			console.log(appIndex, 'of', count, 'items', (appIndex / count * 100).toFixed(2) + "%");
		} catch (e) {
			// ignore
		}
	}
}

run().then(() => {
	fs.writeFileSync("crawled/items.json", JSON.stringify(items));
	console.log("done");
});
