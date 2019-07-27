import * as ssim from "image-ssim"
import * as fs from "fs";
import * as jpg from "jpeg-js";

let csv = "itemIdPremise|itemIdConclusion|support\n";

function load(id) {
	return {
		data: jpg.decode(fs.readFileSync("crawled/" + id + "/2.jpg")).data,
		width: 2,
		height: 2,
		channels: 3
	}
}

async function run() {

	const apps = fs.readdirSync("crawled");


	let i = 0;
	const count = apps.length;
	for (const x of apps) {

		const values = [];

		for (const y of apps) {
			if (x < y) {

				try {
					values.push({key: y, value: ssim.compare(load(x), load(y)).ssim});
				} catch (e) {
					// ignore
				}


			}
		}
		const bestMatches = values.sort((a, b) => b.value - a.value).slice(0, 16);

		for (const match of bestMatches) {
			csv += [x, match.key, match.value].join("|") + "\n";
			csv += [match.key, x, match.value].join("|") + "\n";
		}

		i++;
	}



}

run().then(() => {
	fs.writeFileSync("crawled-meta/resultrules.csv", csv);
	console.log("done");
});