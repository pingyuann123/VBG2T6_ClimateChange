// loadSections.js
function loadSection(url, targetId) {
  fetch(url)
    .then(response => response.text())
    .then(html => {
      document.getElementById(targetId).innerHTML = html;
    })
    .catch(error => {
      console.error(`Error loading ${url}:`, error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSection('../greenhouse.html', 'greenhousesection');
  loadSection('../impact.html', 'impactsection');
  loadSection('../airquality.html', 'airqualitysection');
  loadSection('../urbanization.html', 'urbanizationsection');
  loadSection('../tempUhi.html', 'tempUHIsection');
});