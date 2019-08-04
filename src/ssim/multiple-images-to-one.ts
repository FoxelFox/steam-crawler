import * as fs from "fs";
import * as jpg from "jpeg-js";

let csv = "itemIdPremise|itemIdConclusion|support\n";
let images = {};
const size = parseInt(process.argv[2]);

async function run() {

	let  apps = fs.readdirSync("crawled");
	let i = 0;
	const filesNotFound = [];
	for (const id of apps) {
		try {
			images[id] = {
				data: jpg.decode(fs.readFileSync("crawled/" + id + "/" + size + ".jpg")).data,
				width: size,
				height: size,
				channels: 3
			}

		} catch (e) {
			filesNotFound.push(id);
		}
	}

	apps = apps.filter((e) => filesNotFound.indexOf(e) === -1);


	let base = Math.sqrt(apps.length);
	if (base % 1 !== 0) {
		base = nextPo2(base);
	}

	let base32 = base * 32;

	const data = new Uint8Array(base32 * base32 * 4);

	let index = 0;
	for (const id in images) {

		let iy = Math.floor(index / base);
		let ix = index % base;


		for (let x = 0; x < 32; x++) {
			for (let y = 0; y < 32; y++) {
				for (let c = 0; c < 4; c++) {
					data[(x * 4 + ix * 32 * 4) + (y * base32 * 4 + iy * base32 * 32 * 4)  + c] = images[id].data[(x * 4) + y * 32 * 4 + c]
				}
			}
		}
		index++;

	}

	fs.writeFile("crawled-meta/32.data", data, "binary", (err) => {
		return;
	});

}

function nextPo2(n: number) {
	let i = 0;
	while (n >= Math.pow(2, i)) {
		i++;
	}

	return Math.pow(2, i);
}

run().then(() => {
	fs.writeFileSync("crawled-meta/resultrules.csv", csv);
	console.log("done");
});