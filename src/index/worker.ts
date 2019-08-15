import {expose} from "threads/dist";
import request = require("request");

const worker = {


    getIndex(id) {
        return new Promise((resolve, reject) => {
            request("https://store.steampowered.com/app/" + id, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
                    "Cookie": request.cookie("lastagecheckage=21-0-1988; birthtime=567039601")
                }
            }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            });
        });
    }
};

export type IndexWorker = typeof worker;

expose(worker);