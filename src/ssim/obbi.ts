const fs = require("fs");
import * as jpg from "jpeg-js";

let  apps = fs.readdirSync("crawled");
let i = 0;
const filesNotFound = [];
for (const id of apps) {
	try {
		fs.readFileSync("crawled/" + id + "/" + 32 + ".jpg")

	} catch (e) {
		filesNotFound.push(id);
	}
}

apps = apps.filter((e) => filesNotFound.indexOf(e) === -1).slice(0,1024);



const listOfImages = apps;

const sizeOfImage = 32;
const rootOfNum = Math.sqrt(listOfImages.length);
const targetNumImagesPerRow = Math.floor(rootOfNum);

/**
 *
 * @param {ArrayBuffer} image
 * @param {number} row
 */
function* getImageRow(image, row) {
	const offset = sizeOfImage * row * 4;
	// const pixel = new Uint32Array(image);
	yield image.slice(offset, offset + 4 * sizeOfImage);
}

/**
 *
 * @param {string[]} images
 * @param {number} count
 */
function* openImages(images, count) {
	for (const image of images) {

		console.log(`reading image ${image}`); // fake read
		const data = jpg.decode(fs.readFileSync("crawled/" + image + "/" + 32 + ".jpg")).data;
		const pixels = new Uint32Array(data);
		yield data;
	}
	if (images.length < count) { // generate filler images (transparent bytes)
		const blackImage = new ArrayBuffer(sizeOfImage * sizeOfImage * 4);
		yield* Array.from({ length: count - images.length }, () => blackImage);
	}
}

/**
 *
 * @param {string[]} listOfImages
 */
function* pixelGenerator(listOfImages) {
	console.log("pixelGenerator:", listOfImages.length, "images");
	// per image row
	for (let i = 0; i < listOfImages.length; i += targetNumImagesPerRow) {
		console.log("row: ", i, "--", i + targetNumImagesPerRow);
		const imageData = Array.from(openImages(listOfImages.slice(i, i + targetNumImagesPerRow), targetNumImagesPerRow)); // read row of images
		// per row in image
		for (let r = 0; r < sizeOfImage; r++) {
			for (const image of imageData) {
				yield* getImageRow(image, r);
			}
		}
	}
}

const targetNumRowsOfImages = Math.ceil(listOfImages.length / targetNumImagesPerRow);

const header = `P7
WIDTH ${sizeOfImage * targetNumImagesPerRow}
HEIGHT ${sizeOfImage * targetNumRowsOfImages}
DEPTH 4
MAXVAL 255
TUPLTYPE RGB_ALPHA
ENDHDR
`;

(async () => {
	console.log("Images to process:", listOfImages);
	const ws = fs.createWriteStream("image.ppm");
	ws.write(header);
	for (const pixels of pixelGenerator(listOfImages)) {
		if (!ws.write(Buffer.from(pixels))) {
			await new Promise(resolve => ws.once('drain', resolve));
		}
	}
	ws.end();
})();
