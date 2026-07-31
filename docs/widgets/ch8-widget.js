function initDistributionsWidget({ containerId = "dist-widget" } = {}) {
  const container = document.getElementById(containerId);
  const tabButtons = container.querySelectorAll(".dist-tab-btn");
  const tabPanels = container.querySelectorAll(".dist-tab-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.style.display = "none");
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).style.display = "block";
    });
  });

  const nSamples = 1000;

  function drawHistogram({ samples, container, xDomain, yDomain, nBins, fillColor, height = 400 }) {
    const binWidth = (xDomain[1] - xDomain[0]) / nBins;
    const thresholds = Array.from({ length: nBins + 1 }, (_, i) => xDomain[0] + i * binWidth);
    const plot = Plot.plot({
      height,
      x: { domain: xDomain, label: "x" },
      y: yDomain ? { domain: yDomain, label: "Count" } : { label: "Count" },
      marks: [
        Plot.rectY(samples, Plot.binX({ y: "count" }, { x: "x", fill: fillColor, thresholds }))
      ]
    });
    container.replaceChildren(plot);
  }

  function randomStandardNormal() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // ---- Bernoulli ----
  (function () {
    const pSlider = document.getElementById("p-slider");
    const pLabel = document.getElementById("p-value");
    const plotContainer = document.getElementById("bernoulli-plot");
    const baseUniforms = Array.from({ length: nSamples }, () => Math.random());

    function draw() {
      const p = +pSlider.value;
      pLabel.textContent = p.toFixed(2);
      const successes = baseUniforms.filter(u => u < p).length;
      const barData = [
        { outcome: "0", count: nSamples - successes },
        { outcome: "1", count: successes }
      ];
      const plot = Plot.plot({
        height: 400,
        x: { domain: ["0", "1"], label: "Outcome" },
        y: { domain: [0, nSamples], label: "Count" },
        marks: [Plot.barY(barData, { x: "outcome", y: "count", fill: "#F06A2A" })]
      });
      plotContainer.replaceChildren(plot);
    }
    pSlider.addEventListener("input", draw);
    draw();
  })();

  // ---- Uniform ----
  (function () {
    const minSlider = document.getElementById("min-slider");
    const maxSlider = document.getElementById("max-slider");
    const minLabel = document.getElementById("min-value");
    const maxLabel = document.getElementById("max-value");
    const plotContainer = document.getElementById("uniform-plot");
    const xDomain = [-10, 10];
    const baseUniforms = Array.from({ length: nSamples }, () => Math.random());

    function draw() {
      let lo = +minSlider.value, hi = +maxSlider.value;
      if (lo > hi) [lo, hi] = [hi, lo];
      minLabel.textContent = lo.toFixed(1);
      maxLabel.textContent = hi.toFixed(1);
      const samples = baseUniforms.map(u => ({ x: lo + u * (hi - lo) }));
      drawHistogram({ samples, container: plotContainer, xDomain, yDomain: [0, nSamples], nBins: 60, fillColor: "#5B8C5A" });
    }
    minSlider.addEventListener("input", draw);
    maxSlider.addEventListener("input", draw);
    draw();
  })();

  // ---- Normal ----
  (function () {
    const meanSlider = document.getElementById("mean-slider");
    const sdSlider = document.getElementById("sd-slider");
    const meanLabel = document.getElementById("mean-value");
    const sdLabel = document.getElementById("sd-value");
    const plotContainer = document.getElementById("normal-plot");
    const xDomain = [-15, 15];
    const baseZ = Array.from({ length: nSamples }, randomStandardNormal);

    function draw() {
      const mean = +meanSlider.value, sd = +sdSlider.value;
      meanLabel.textContent = mean.toFixed(1);
      sdLabel.textContent = sd.toFixed(1);
      const samples = baseZ.map(z => ({ x: mean + sd * z }));
      drawHistogram({ samples, container: plotContainer, xDomain, yDomain: [0, 350], nBins: 60, fillColor: "#3B7EA1" });
    }
    meanSlider.addEventListener("input", draw);
    sdSlider.addEventListener("input", draw);
    draw();
  })();
}