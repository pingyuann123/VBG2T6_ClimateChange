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
    loadSection('../urbanization.html', 'urbanizationsection');
  });
  