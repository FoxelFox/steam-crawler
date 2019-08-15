import {expose} from "threads/dist";
import * as fs from "fs";

const compareWorker = {
    getBestMatches(items, map) {
        let csv = "";
        for (const id of items) {
            const list = [];
            for (const key in map) {
                if (id !== key) {
                    const a = map[id];
                    const b = map[key];
                    let sim = 0;
                    for (const tagA in a) {

                        for (const tagB in b) {
                            if (tagA === tagB) {
                                sim += Math.min(a[tagA], b[tagB]);
                            }
                        }
                    }

                    list.push({key, sim});
                }
            }

            const matches = list.sort((a, b) =>
                b.sim - a.sim
            ).slice(0, 16);


            for (const match of matches) {
                csv += [id, match.key, match.sim].join("|") + "\n";
            }
        }
        return csv;
    }
};

export type CompareWorker = typeof compareWorker;

expose(compareWorker);