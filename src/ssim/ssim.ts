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

	for (const item of apps) {
		pool.queue(async thread => {
			csv += await thread.work(item, apps, images);
		});
	}

	await pool.completed();
	await pool.terminate();
}

run().then(() => {
	fs.writeFileSync("crawled-meta/resultrules.csv", csv);
	console.log("done");
});