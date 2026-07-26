function initNormalWidget({
  meanSliderId, sdSliderId, meanLabelId, sdLabelId, plotContainerId,
  xDomain = [-15, 15], yDomain = [0, 400], nSamples = 1000, nBins = 60,
  fillColor = "#3B7EA1", height = 400
}) {
  const meanSlider = document.getElementById(meanSliderId);
  const sdSlider = document.getElementById(sdSliderId);
  const meanLabel = document.getElementById(meanLabelId);
  const sdLabel = document.getElementById(sdLabelId);
  const container = document.getElementById(plotContainerId);

  function randomStandardNormal() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  const baseZ = Array.from({ length: nSamples }, randomStandardNormal);

  const binWidth = (xDomain[1] - xDomain[0]) / nBins;
  const thresholds = Array.from({ length: nBins + 1 }, (_, i) => xDomain[0] + i * binWidth);

  function draw() {
    const mean = +meanSlider.value;
    const sd = +sdSlider.value;
    meanLabel.textContent = mean.toFixed(1);
    sdLabel.textContent = sd.toFixed(1);

    const samples = baseZ.map(z => ({ x: mean + sd * z }));

    const plot = Plot.plot({
      height,
      x: { domain: xDomain, label: "x" },
      y: { domain: yDomain, label: "Count" },
      marks: [
        Plot.rectY(samples, Plot.binX({ y: "count" }, { x: "x", fill: fillColor, thresholds }))
      ]
    });
    container.replaceChildren(plot);
  }

  meanSlider.addEventListener('input', draw);
  sdSlider.addEventListener('input', draw);
  draw();
}