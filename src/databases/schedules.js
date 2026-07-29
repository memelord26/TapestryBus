import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

//read local pdf file into a buffer
let dataBuffer = fs.readFileSync('15Jul26.pdf');

pdf(dataBuffer).then(function(data) {
    //total num of pages
    console.log("Total Pages: ", data.numpages);
    //metadata info
    console.log("Metadata: ", data.info);
    //full scraped text content
    console.log("\n--- Extracted Text ---");
    console.log(data.text);
}).catch(function(error) {
    console.error("Failed to parse file: ", error);
});