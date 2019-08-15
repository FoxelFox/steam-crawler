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
    fs.writeFileSync("crawled-meta/tag-results.csv", csv);
    let i = 0;

    const map = {};
    let errorLoad = 0;
    const appsWithTags = [];
    for (const app of apps) {
        poolLoad.queue(async thread => {
            try {
                const tags = await thread.getTags(app);
                if(Object.keys(tags).length) {
                    appsWithTags.push(app);
                    map[app] = tags;
                }
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

    const count = appsWithTags.length;



    let index = 0;
    while (index < appsWithTags.length) {
        const items = appsWithTags.slice(index, index + 100);
        poolCompare.queue(async thread => {
            try {
                const result = await thread.getBestMatches(items, map);

                fs.appendFileSync("crawled-meta/tag-results.csv", result);
                clear();

                i += 100;
                console.log(i, 'of', count, 'items', (i / count * 100).toFixed(2) + "%");
            } catch {

            }
        });
        index += 100;
    }
}

run().then(() => {
    console.log("done");
});