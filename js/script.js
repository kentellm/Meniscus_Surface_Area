const outerInput = document.getElementById('outerRadius');
const innerInput = document.getElementById('innerRadius');
const sphereInput = document.getElementById('sphereRadius');

const areaFlatSpan = document.getElementById('areaFlat');
const areaMeniscusSpan = document.getElementById('areaMeniscus');
const areaTotalSpan = document.getElementById('areaTotal');
const areaIncrease = document.getElementById('areaIncrease');

function updateAreas() {
  let R = Number(outerInput.value);
  let r = Number(innerInput.value);
  let S = Number(sphereInput.value);

  if (r > R) {
    r = R;
    innerInput.value = R;
  }

  // Guard: S must be >= R for valid spherical cap
  if (S < R) {
    S = R;
    sphereInput.value = R;
  }

  const pi = Math.PI;
  const A_flat = pi * R * R;
  const hR = S - Math.sqrt(S * S - R * R);
  const hr = (r > 0) ? S - Math.sqrt(S * S - r * r) : 0;
  const A_meniscus = 2 * pi * S * (hR - hr);
  const A_total = pi * r * r + A_meniscus;
  const Perc_inc = ((A_total - A_flat) / A_total) * 100;

  areaFlatSpan.textContent = A_flat.toFixed(2);
  areaMeniscusSpan.textContent = A_meniscus.toFixed(2);
  areaTotalSpan.textContent = A_total.toFixed(2);
  areaIncrease.textContent = Perc_inc.toFixed(2);

  // ✅ Call diagram update here with the correct local values
  updateDiagram(R, r, S);
}

function updateDiagram(R, r, S) {
  const svg = document.getElementById("diagram");
  const meniscusArc = document.getElementById("meniscusArc");
  const flatLine = document.getElementById("flatLine");
  const wallLeft = document.getElementById("wallLeft");
  const wallRight = document.getElementById("wallRight");
  const labelR = document.getElementById("labelR");
  const labelr = document.getElementById("labelr");
  const labelS = document.getElementById("labelS");

  const svgWidth = 400;
  const svgHeight = 300;
  const centerX = svgWidth / 2;
  const topY = 60;
  const bottomY = svgHeight - 40;

  // ✅ Scale so R always fits nicely in the SVG
  const scale = (svgWidth * 0.4) / R;

  const hR = S - Math.sqrt(S * S - R * R);
  const hr = (r > 0) ? S - Math.sqrt(S * S - r * r) : 0;

  const yR = topY + hR * scale;
  const yr = topY + hr * scale;

  // ✅ Fixed: added y1 and y2 to wall lines
  wallLeft.setAttribute("x1", centerX - R * scale);
  wallLeft.setAttribute("y1", topY);
  wallLeft.setAttribute("x2", centerX - R * scale);
  wallLeft.setAttribute("y2", bottomY);

  wallRight.setAttribute("x1", centerX + R * scale);
  wallRight.setAttribute("y1", topY);
  wallRight.setAttribute("x2", centerX + R * scale);
  wallRight.setAttribute("y2", bottomY);

  const xStart = centerX - R * scale;
  const xEnd = centerX + R * scale;

  const arcPath = `M ${xStart} ${yR} A ${S * scale} ${S * scale} 0 0 0 ${xEnd} ${yR}`;
  meniscusArc.setAttribute("d", arcPath);

  const yCenterArc = yR + (hR - hr) * scale;

  flatLine.setAttribute("x1", centerX - r * scale);
  flatLine.setAttribute("y1", yCenterArc);
  flatLine.setAttribute("x2", centerX + r * scale);
  flatLine.setAttribute("y2", yCenterArc);

  labelR.textContent = `Outer radius R = ${R}`;
  labelr.textContent = `Inner flat radius r = ${r}`;
  labelS.textContent = `Sphere radius S = ${S}`;
}

outerInput.addEventListener('input', updateAreas);
innerInput.addEventListener('input', updateAreas);
sphereInput.addEventListener('input', updateAreas);
// ✅ Remove the bad global call — updateAreas() will call updateDiagram internally
updateAreas();
