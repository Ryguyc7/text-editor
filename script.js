const GOOGLE_FONTS_API_KEY = "GOOGLE_FONTS_API_KEY"; // Replace this

const preview = document.getElementById("preview");
const textInput = document.getElementById("textInput");

const fontSearch = document.getElementById("fontSearch");
const fontPicker = document.getElementById("fontPicker");

const zoom = document.getElementById("zoom");
const spacing = document.getElementById("spacing");
const lineHeight = document.getElementById("lineHeight");
const rotation = document.getElementById("rotation");

const textColor = document.getElementById("textColor");
const backgroundColor = document.getElementById("backgroundColor");
const gradient = document.getElementById("gradient");
const gradientColor1 = document.getElementById("gradientColor1");
const gradientColor2 = document.getElementById("gradientColor2");
const gradientAngle = document.getElementById("gradientAngle");

const shadow = document.getElementById("shadow");
const shadowColor = document.getElementById("shadowColor");
const shadowX = document.getElementById("shadowX");
const shadowY = document.getElementById("shadowY");
const shadowBlur = document.getElementById("shadowBlur");

const outline = document.getElementById("outline");
const outlineWidth = document.getElementById("outlineWidth");
const outlineColor = document.getElementById("outlineColor");

const quality = document.getElementById("quality");
const downloadPNG = document.getElementById("downloadPNG");
const copyImage = document.getElementById("copyImage");

//let allFonts = [];

//fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${GOOGLE_FONTS_API_KEY}`)
//  .then(res => res.json())
//  .then(data => {
//    allFonts = data.items.map(font => font.family);
//    populateFontPicker(allFonts);
//  });

let allFonts = ["Roboto", "Montserrat", "Open Sans", "Lobster", "Oswald"];

populateFontPicker(allFonts);


function populateFontPicker(fontList) {
  fontPicker.innerHTML = "";
  fontList.forEach(font => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    fontPicker.appendChild(option);
  });
  loadSelectedFont();
}

function loadSelectedFont() {
  const selectedFont = fontPicker.value;
  const fontUrl = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, '+')}&display=swap`;
  const link = document.createElement("link");
  link.href = fontUrl;
  link.rel = "stylesheet";
  document.head.appendChild(link);
  preview.style.fontFamily = `'${selectedFont}', sans-serif`;
}

fontSearch.addEventListener("input", () => {
  const value = fontSearch.value.toLowerCase();
  const filtered = allFonts.filter(f => f.toLowerCase().includes(value));
  populateFontPicker(filtered);
});

fontPicker.addEventListener("change", () => {
  loadSelectedFont();
  updatePreview();
});

function updatePreview() {
  preview.textContent = textInput.value;
  preview.style.transform = `scale(${zoom.value}) rotate(${rotation.value}deg)`;
  preview.style.letterSpacing = `${spacing.value}px`;
  preview.style.lineHeight = lineHeight.value;

  if (gradient.checked) {
    preview.style.background = `linear-gradient(${gradientAngle.value}deg, ${gradientColor1.value}, ${gradientColor2.value})`;
    preview.style.webkitBackgroundClip = "text";
    preview.style.webkitTextFillColor = "transparent";
  } else {
    preview.style.background = "none";
    preview.style.webkitBackgroundClip = "";
    preview.style.webkitTextFillColor = "";
    preview.style.color = textColor.value;
  }

  preview.style.textShadow = shadow.checked
    ? `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowColor.value}`
    : "none";

  preview.style.webkitTextStroke = outline.checked ? `${outlineWidth.value}px ${outlineColor.value}` : "0";
}

[
  textInput, zoom, spacing, lineHeight, rotation,
  textColor, backgroundColor, gradient, gradientColor1, gradientColor2, gradientAngle,
  shadow, shadowColor, shadowX, shadowY, shadowBlur,
  outline, outlineWidth, outlineColor
].forEach(el => el.addEventListener("input", updatePreview));

updatePreview();

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

downloadPNG.addEventListener("click", () => {
  html2canvas(preview, {
    scale: parseInt(quality.value),
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "styled-text.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});

copyImage.addEventListener("click", async () => {
  const canvas = await html2canvas(preview, { backgroundColor: null });
  canvas.toBlob(blob => {
    navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
  });
});
