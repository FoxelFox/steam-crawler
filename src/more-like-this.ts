import * as fs from "fs";

let csv = "itemIdPremise|itemIdConclusion|support\n";

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
							csv += [app, edge, 1].join("|") + "\n"
						}
					}
				}
				i++;

				if (i === count) {
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