import {Pool, spawn, Worker} from "threads/dist";
import * as fs from "fs";
import {LoadWorker} from "./load-worker";
import {CompareWorker} from "./compare-worker";
import clear = require("clear");


async function run() {
    const apps = fs.readdirSync("crawled");
    const poolLoad = Pool(() => spawn<LoadWorker>(new Worker("./load-worker")));
    const poolCompare = Pool(() => spawn<CompareWorker>(new Worker("./compare-worker")));

    let csv = "p|c|s\n";
    let i = 0;

    const map = {};
    let errorLoad = 0;
    for (const app of apps) {
        poolLoad.queue(async thread => {
            try {
                map[app] = await thread.getTags(app);
            } catch (e) {
                errorLoad++;
            }
        });
    }

    try {
        await poolLoad.completed();
        await poolLoad.terminate();
    } catch (e) {
        // hmm ?
    }

    const count = apps.length;

    let index = 0;
    while (index < apps.length) {
        const items = apps.slice(index, index + 100);
        poolCompare.queue(async thread => {
            try {
                const result = await thread.getBestMatches(items, map);
                csv += result;

                clear();

                i += 100;
                console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%");
            } catch {

            }
        });
        index += 100;
    }



    fs.writeFileSync("crawled-meta/tag-results.csv", csv);
}

run().then(() => {
    console.log("done");
});