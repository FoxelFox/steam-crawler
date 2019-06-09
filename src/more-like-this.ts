import * as fs from "fs";

let csv = "itemIdPremise|itemIdConclusion|support\n";

const directMap = {};
const indirectMap = {};

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
							if (!directMap[app]) {
								directMap[app] = [];
							}

							if (directMap[app].indexOf(edge) === -1) {
								directMap[app].push(edge);
							}

							if (!indirectMap[edge]) {
								indirectMap[edge] = [];
							}



							if (indirectMap[edge].indexOf(app) === -1) {
								indirectMap[edge].push(app);
							}

						}
					}
				}
				i++;

				if (i === count) {

					for (const key in indirectMap) {
						if (!directMap[key]) {
							directMap[key] = indirectMap[key].slice(0, 15);
						}
					}



					for (const key in directMap) {
						for (const edge of directMap[key]) {
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