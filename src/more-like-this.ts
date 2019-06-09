import * as fs from "fs";

let csv = "itemIdPremise|itemIdConclusion|support\n";

const map = {};

async function run() {
	return new Promise((resolve) => {
		const apps = fs.readdirSync("crawled");

		const count = apps.length;
		let i = 0;
		for (const app of apps) {
			fs.readFile("crawled/" + app + "/index.html", {encoding: "utf-8"}, (err, data) => {
				if (!err) {
					const match = data.match(/(RenderMoreLikeThisBlock.*)/g);
					if (match) {
						const edges = JSON.parse("[" + match[0].split("[")[1].split("]")[0] + "]");
						for (const edge of edges) {
							if (!map[app]) {
								map[app] = [];
							}

							if (!map[edge]) {
								map[edge] = [];
							}

							if (map[app].indexOf(edge) === -1) {
								map[app].push(edge);
							}

							if (map[edge].indexOf(app) === -1) {
								map[edge].push(app);
							}

						}
					}
				}
				i++;

				if (i === count) {
					for (const key in map) {
						for (const edge of map[key]) {
							csv += [key, edge, 1].join("|") + "\n";
						}
					}
					resolve(csv);
				}
			});
		}
	});

}



run().then((csv) => {
	if (!fs.existsSync("crawled-meta")) {
		fs.mkdirSync("crawled-meta");
	}

	fs.writeFileSync("crawled-meta/resultrules.csv", csv);

	console.log("done");
});