import * as mobilenet from '@tensorflow-models/mobilenet';
import * as fs from "fs";
import * as jpg from "jpeg-js";
const tf = require('@tensorflow/tfjs')

require('@tensorflow/tfjs-node');

const imageByteArray = (image, numChannels) => {
	const pixels = image.data;
	const numPixels = image.width * image.height;
	const values = new Int32Array(numPixels * numChannels);

	for (let i = 0; i < numPixels; i++) {
		for (let channel = 0; channel < numChannels; ++channel) {
			values[i * numChannels + channel] = pixels[i * 4 + channel];
		}
	}

	return values
};

const imageToInput = (image, numChannels) => {
	const values = imageByteArray(image, numChannels);
	const outShape = [image.height, image.width, numChannels];
	const input = tf.tensor3d(values, outShape, 'int32');

	return input
};

function loadIMG(id) {
	return imageToInput(jpg.decode(fs.readFileSync("crawled/" + id + "/64.jpg"), true), 3);
}

async function run() {
	const img = loadIMG(81583);

// Load the model.
	const model = await mobilenet.load();

// Classify the image.
	const infer = await model.infer(img);
	const classifycation = await model.classify(img);

	console.log(infer);
	console.log(classifycation);
}

run().then(() => {
	console.log("done");
});