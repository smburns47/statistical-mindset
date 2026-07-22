function initQuartileWidget({
  dataElementId, sliderId, scatterId, histId, labelId,
  xVar, yVar, nBins = 20,
  dotSize = 4,
  scatterHeight = 400, histHeight = 400,
  scatterFontSize = "16px", histFontSize = "40px",
  highlightColor = "#F06A2A", baseColor = "#3B7EA1"
}) {
  const data = JSON.parse(document.getElementById(dataElementId).textContent);

  const yExtent = [
    Math.min(...data.map(d => d[yVar])),
    Math.max(...data.map(d => d[yVar]))
  ];
  const binWidth = (yExtent[1] - yExtent[0]) / nBins;
  const thresholds = Array.from({ length: nBins + 1 }, (_, i) => yExtent[0] + i * binWidth);

  const slider = document.getElementById(sliderId);
  const valueLabel = document.getElementById(labelId);
  const scatterContainer = document.getElementById(scatterId);
  const histContainer = document.getElementById(histId);

  function draw() {
    const selectedQuartile = +slider.value;
    if (valueLabel) valueLabel.textContent = selectedQuartile;

    scatterContainer.replaceChildren(Plot.plot({
      height: scatterHeight,
      marginBottom: 40,
      style: { fontSize: scatterFontSize },
      marks: [
        Plot.dot(data, {
          x: xVar,
          y: yVar,
          r: dotSize,
          fill: d => d.x_bin === selectedQuartile ? highlightColor : baseColor,
          fillOpacity: d => d.x_bin === selectedQuartile ? 0.9 : 0.15
        })
      ]
    }));

    const filtered = data.filter(d => d.x_bin === selectedQuartile);
    histContainer.replaceChildren(Plot.plot({
      x: { axis: null },
      y: { domain: yExtent, axis: null },
      style: { fontSize: histFontSize },
      height: histHeight,
      marks: [
        Plot.rectX(filtered, Plot.binY({ x: "count" }, { y: yVar, fill: highlightColor, thresholds }))
      ]
    }));
  }

  slider.addEventListener('input', draw);
  draw();
}