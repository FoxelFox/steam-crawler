import * as fs from "fs";
import sharp = require('sharp');
import clear = require("clear");

const apps = fs.readdirSync("crawled");
let i = 0;
const count = apps.length;


async function run() {
	for (const app of apps) {

		if (!fs.existsSync("crawled/" + app+ "/" + process.argv[2] + ".jpg")) {
			try {
				await sharp("crawled/" + app+ "/header.jpg").resize(process.argv[2], process.argv[2]).toFile("crawled/" + app + "/" + process.argv[2] + ".jpg")
			} catch (e) {
				// ignore
			}
		}

		++i;
		clear();
		console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%");

	}
}

run().then(() => {
	console.log("done");
});




