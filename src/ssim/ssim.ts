import * as fs from "fs";
import * as jpg from "jpeg-js";
import clear = require("clear");
import { spawn, Thread, Worker, Pool } from "threads"
import {SSIMWorker} from "./thread";

let csv = "itemIdPremise|itemIdConclusion|support\n";
const images = {};
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
	const count = apps.length;

	const pool = Pool(() => spawn<SSIMWorker>(new Worker("./thread")));

	try {
		let index = 0;
		while (index < apps.length) {
			const items = apps.slice(index, index + 1000);
			pool.queue(async thread => {
				csv += await thread.work(items, apps, images);
				i += 1000;
				clear();
				console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%");
			});
			index += 1000;
		}
	} catch (e) {
		console.log(e);
		// fuck it
	}

	try {
		await pool.completed();
		await pool.terminate();
	} catch (e) {

	}
	
}

run().then(() => {
	fs.writeFileSync("crawled-meta/resultrules.csv", csv);
	console.log("done");
});