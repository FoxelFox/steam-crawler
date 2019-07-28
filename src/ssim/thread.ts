import {expose} from "threads/dist";
import * as ssim from "image-ssim";


let csv = "";

const worker = {


	work(item, apps, images) {
		const values = [];

		for (const y of apps) {
			if (item !== y) {
				values.push({key: y, value: ssim.compare(images[item], images[y]).ssim});
			}
		}
		const bestMatches = values.sort((a, b) => b.value - a.value).slice(0, 16);

		for (const match of bestMatches) {
			csv += [item, match.key, match.value].join("|") + "\n";
		}

		return csv;
	}
};

export type SSIMWorker = typeof worker;

expose(worker);