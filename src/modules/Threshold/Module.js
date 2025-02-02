/*
 * Image thresholding with 'image-filter-threshold'
 */
module.exports = function ImageThreshold(options, UI) {

  var output;

  function draw(input, callback, progressObj) {

    progressObj.stop(true);
    progressObj.overrideFlag = true;

    var step = this, hist = new Array(256).fill(0);

    function changePixel(r, g, b, a) {
      let pixVal = Math.round((r + g + b) / 3);
      hist[pixVal]++;
      return [r, g, b, a];
    }

    function extraManipulation(pixels) {
      pixels = require('./Threshold')(pixels, options, hist);
      return pixels;
    }
    function output(image, datauri, mimetype) {
      // This output is accessible by Image Sequencer
      step.output = { src: datauri, format: mimetype };
    }
    return require('../_nomodule/PixelManipulation.js')(input, {
      output: output,
      ui: options.step.ui,
      changePixel: changePixel,
      extraManipulation: extraManipulation,
      format: input.format,
      image: options.image,
      callback: callback
    });
  }
  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  };
};
