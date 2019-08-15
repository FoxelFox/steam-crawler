import {expose} from "threads/dist";
import * as fs from "fs";

const loadWorker = {
    getTags(id) {
        const data = fs.readFileSync("crawled/" + id + "/index.html", {encoding: "utf-8"});
        const start = data.indexOf("[", data.indexOf("InitAppTagModal"));
        const end = data.indexOf("]", start);
        const tags = JSON.parse(data.substr(start, end - start + 1));

        let sum = 0;
        for (const tag of tags) {
            sum += tag.count;
        }

        const map = {};
        for (const tag of tags) {
            map[tag.tagid] = tag.count / sum;
        }
        return map;
    }
};

export type LoadWorker = typeof loadWorker;

expose(loadWorker);
