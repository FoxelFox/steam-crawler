import * as ssim from "image-ssim"
import * as fs from "fs";
import * as jpg from "jpeg-js";
import clear = require("clear");

let csv = "itemIdPremise|itemIdConclusion|support\n";
const images = {};

async function run() {

	let  apps = fs.readdirSync("crawled");
	let i = 0;
	const filesNotFound = [];
	for (const id of apps) {
		try {
			images[id] = {
				data: jpg.decode(fs.readFileSync("crawled/" + id + "/2.jpg")).data,
				width: 2,
				height: 2,
				channels: 3
			}
		} catch (e) {
			filesNotFound.push(id);
		}
	}

	apps = apps.filter((e) => filesNotFound.indexOf(e) === -1);

	const count = apps.length;

	for (const x of apps) {

		const values = [];

		for (const y of apps) {
			if (x !== y) {
				values.push({key: y, value: ssim.compare(images[x], images[y]).ssim});
			}
		}
		const bestMatches = values.sort((a, b) => b.value - a.value).slice(0, 16);

		for (const match of bestMatches) {
			csv += [x, match.key, match.value].join("|") + "\n";
		}

		i++;
		clear();
		console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%");


	}



}

run().then(() => {
	fs.writeFileSync("crawled-meta/resultrules.csv", csv);
	console.log("done");
});