// loadSections.js
const sectionsToLoad = [
  { url: '../greenhouse.html', id: 'greenhousesection' },
  { url: '../impact.html', id: 'impactsection' },
  { url: '../airquality.html', id: 'airqualitysection' },
  { url: '../urbanization.html', id: 'urbanizationsection' },
  { url: '../tempUhi.html', id: 'tempUHIsection' }
];

let sectionsLoaded = 0;

function loadSection(url, targetId) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(html => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.innerHTML = html;
      }
      sectionsLoaded++;
      if (sectionsLoaded === sectionsToLoad.length) {
        // All sections loaded → now load scatter.js
        loadScatterScript();
      }
    })
    .catch(error => console.error(`Error loading ${url}:`, error));
}

function loadScatterScript() {
  const script = document.createElement('script');
  script.src = './scatter.js'; // path to your scatter.js
  document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
  sectionsToLoad.forEach(section => loadSection(section.url, section.id));
});
