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
				const size = parseInt(process.argv[2]);
				await sharp("crawled/" + app+ "/header.jpg").resize(size, size).toFile("crawled/" + app + "/" + process.argv[2] + ".jpg")
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




