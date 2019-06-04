import * as fs from "fs";
import sharp = require('sharp');
import clear = require("clear");

const apps = fs.readdirSync("crawled");
let i = 0;
const count = apps.length;


async function run() {
	for (const app of apps) {

		if (!fs.existsSync("crawled/" + app+ "/128.jpg")) {
			try {
				await sharp("crawled/" + app+ "/header.jpg").resize(128, 128).toFile("crawled/" + app + "/128.jpg")
			} catch (e) {
				// ignore
			}
		}

		++i;
		clear();
		console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%");

	}
}

run();

console.log("done");


