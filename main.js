/*******************Script definition section **************/

// select img div and insert world GHI map from as CanvasRenderingContext2D
 // TODO: img div is hidden so really need to just pull data from image file directly
const img = document.querySelector('#world-ghi');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let mainDiv = document.querySelector('#main');

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img, 0, 0);

console.log('Script is working!');

// Pull Pixel data from Canvas
const rgbaImageData = ctx.getImageData(
  0, 0, img.width, img.height);

// Add canvas with image to main div as child
mainDiv.appendChild(canvas);

const colorLegendDims = {x: 43, y: 26};

let energyCategories = buildEnergyCategories();

console.log('Energy Categories:', energyCategories);

let categoryAverages = calculateEnergyColorAverages();

for(i = 0; i < 28; i++) {
  logColor(categoryAverages[i], `Color category ${i}: `);
}

let globalSolarAverageDaily = calculateGlobalSolarEnergyAverage();

let displayDiv = document.getElementById('display');
displayDiv.innerHTML = `Global Daily Average Solar Energy: ${globalSolarAverageDaily} kWh/m^2/day`
canvas.after(displayDiv);

canvas.addEventListener("mousedown", e => getPixelData(e))

console.log('imageData length', rgbaImageData.data.length);

let imageAvgColor = calculateWholeImageAverageColor();

// Draw rectangle with background color matching average pixel color of above image
let pixelColor = document.querySelector('#pixel-color');
console.log(pixelColor);
pixelColor.style.height = '100px';
pixelColor.style.width = '100px';

pixelColor.style.backgroundColor = `rgba(${imageAvgColor[0]}, ${imageAvgColor[1]}, ${imageAvgColor[2]}, ${imageAvgColor[3]})`;

/*************************Function definition section********/

function fillLegendColors() {
  let x, y;
  for(i = 0; i < 28; i++) {
    x = 303 + i * (1578 - 303)/27;
    y = 963;
    ctx.fillRect(colorLegendDims.x, colorLegendDims.y, 43, 26); //43, 26
  }
}

function logColor (rgba, message = '') {
  let cssRGBA = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
  console.log(`'${message}%cR${rgba[0]}, G${rgba[1]}, B${rgba[2]}, A${rgba[3]}`, `background: ${cssRGBA}`);
}

function buildEnergyCategories () {
  let energyCategories = [];

  for(i = 0; i < 28; i++) {
    bucket = {
      daily: 2.1 + i * 0.2,
      yearly: 766.5 + i * 73
    }
    energyCategories.push(bucket)
  }

  return energyCategories;
}

/*
*Find the average color of each of the energy legend color boxes
*/
function calculateEnergyColorAverages() {
  let averages = [];
  for(i = 0; i < 28; i++) {
    x = 303 + i * (1578 - 303)/27;
    y = 963;
    let rgbaData, redSum = 0, greenSum = 0, blueSum = 0, alphaSum = 0;
    let pixelCount = colorLegendDims.x * colorLegendDims.y;

    for(let j = 0; j < 43; j++) {
      for(let k = 0; k < 26; k++) {
        // console.log(`x: ${x + j}, y: ${y}`)
        rgbaData = ctx.getImageData(x + j, 963 + k, 1, 1).data;
        //console.log(rgbaData);
        redSum += rgbaData[0];
        greenSum += rgbaData[1];
        blueSum += rgbaData[2];
        alphaSum += rgbaData[3];
      }
    }

    redAvg = redSum/pixelCount;
    greenAvg = greenSum/pixelCount;
    blueAvg = blueSum/pixelCount;
    alphaAvg = alphaSum/pixelCount;
    console.log(`Position ${i}, R${redAvg}, G${greenAvg}, B${blueAvg}, A${alphaAvg}`);
    averages.push([redAvg, greenAvg, blueAvg, alphaAvg]);
  }
  return averages;
}

function findClosestCategory(rgba, averages) {
  let redDist, greenDist, blueDist, distSum, closestCategory, smallestDist = Number.MAX_VALUE;
  for(i = 0; i < 28; i++) {
    category = averages[i];
    redDist = Math.abs(rgba[0] - category[0]);
    greenDist = Math.abs(rgba[1] - category[1]);
    blueDist = Math.abs(rgba[2] - category[2]);
    distSum = redDist + greenDist + blueDist;
    if(distSum < smallestDist) {
      smallestDist = distSum;
      closestCategory = i;
    }
  }

  return closestCategory;
}

// Calculate average color for the whole image. Not very useful in current state since it include white/grey space and text, logos, and color legend
function calculateWholeImageAverageColor() {
  let RedSum = 0, GreenSum = 0, BlueSum = 0, AlphaSum = 0;

  for(let i = 0; i < rgbaImageData.data.length; i += 4) {
    RedSum += rgbaImageData.data[i];
    GreenSum += rgbaImageData.data[i + 1];
    BlueSum += rgbaImageData.data[i + 2];
    AlphaSum += rgbaImageData.data[i + 3];
  }
  
  const pixelCount = rgbaImageData.data.length / 4;
  
  let RedAverage = RedSum/pixelCount;
  let GreenAverage = GreenSum/pixelCount;
  let BlueAverage = BlueSum/pixelCount;
  let AlphaAverage = AlphaSum/pixelCount;
  console.log('RGBA avg: ', RedAverage, GreenAverage, BlueAverage, AlphaAverage);
  return [RedAverage, GreenAverage, BlueAverage, AlphaAverage];
}

// pull the pixel data for the clicked on pixel. Log x, y coordinates and rgba color values, with background color of rgba values set to that color.
function getPixelData(event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y  = event.clientY - rect.top;
  let pixelColor = ctx.getImageData(x, y, 1, 1).data;
  console.log("Coordinate x: " + x,
              "coordinate y: " + y,
              `\npixel color: R${pixelColor[0]}, G${pixelColor[1]}, B${pixelColor[2]}, A${pixelColor[3]}`);
  let closestCategory = findClosestCategory(pixelColor, categoryAverages);
  let avgEnergy = energyCategories[closestCategory];
  let colorLogMessage = `closest category: ${i}, daily energy: ${avgEnergy.daily} kWh/m^2, yearly energy: ${avgEnergy.yearly} GWh/km^2/yr, color: `
  logColor(categoryAverages[closestCategory], colorLogMessage);
  let inGreySpect = inGreySpectrum(pixelColor);
  console.log('Pixel in grey spectrum?: ', inGreySpect);
}

function yPosToImageDataPos(yPos) {
  return yPos * img.width * 4;
}

// The whole point of this script. Find the average global horizontal average solar insolation, on a kWh/m^2/day basis, for all colored land, i.e. pixels in image not on grey spectrum, within the defined boundaries (y_min = 170px, y_max = 870px)
function calculateGlobalSolarEnergyAverage() {
  let energySum = 0;
  let includedPixelCount = 0;
  let startPos = yPosToImageDataPos(170);
  let endPos = yPosToImageDataPos(870);
  for(let i = startPos; i < endPos; i += 4) {
    red = rgbaImageData.data[i];
    green = rgbaImageData.data[i + 1];
    blue = rgbaImageData.data[i + 2];
    alpha = rgbaImageData.data[i + 3];
    let rgba = [red, green, blue, alpha];
    if(!inGreySpectrum(rgba)) {
      let closestCategory = findClosestCategory(rgba, categoryAverages);
      let avgEnergy = energyCategories[closestCategory];
      energySum += avgEnergy.daily;
      includedPixelCount += 1;
    }
  }

  let avgDailyEnergyGlobal = energySum / includedPixelCount;

  console.log('Global average daily energy: ', avgDailyEnergyGlobal, 'kWh/m^2/day');
  return avgDailyEnergyGlobal;
}

// check if the provided color, given in rgba format, falls on the grey spectrum. In other words, are rgb values close to each other (all are <7 difference in value b/w each other)
function inGreySpectrum(rgba) {
  let redGreenDistance = Math.abs(rgba[0] - rgba[1]);
  let greenBlueDistance = Math.abs(rgba[1] - rgba[2]);
  let blueRedDistance = Math.abs(rgba[2] - rgba[0]);
  return redGreenDistance < 7 && greenBlueDistance < 7 && blueRedDistance < 7;
}

// color all pixels in image black if on the grey spectrum, and white if they are not. This was supposed to be the way to check if inGreySpectrum is correctly classifying pixels, but so far it runs forever and I haven't bothered waiting to see if it finished, correctly or otherwise.
function blockOutGreySpectrumPixels() {
  for(i = 0; i < img.width; i++) {
    for(j = 0; j < img.height; i++) {
      let pixelColor = ctx.getImageData(i, j, 1, 1).data;
      if(inGreySpectrum(pixelColor)) {
        ctx.fillStyle = 'black';
      } else {
        ctx.fillStyle = 'white';
      }
      ctx.fillRect(i, j, 1, 1);
    }
  }
}
