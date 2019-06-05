import * as ssim from "image-ssim"
import * as fs from "fs";
import * as jpg from "jpeg-js";


function load(id) {
	return {
		data: jpg.decode(fs.readFileSync("crawled/" + id + "/64.jpg")).data,
		width: 64,
		height: 64,
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
			if (x !== y) {

				try {
					values.push({key: y, value: ssim.compare(load(x), load(y)).ssim});
				} catch (e) {
					// ignore
				}


			}
		}

		console.log(x, values.sort((a, b) => b.value - a.value).slice(0, 16));

		i++;
	}



}

run().then(() => {
	console.log("done");
});