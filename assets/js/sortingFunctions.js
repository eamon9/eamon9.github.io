// Funkcija, kas kārto pēc datuma
export function sortProjects(sortBy) {
  const container = document.getElementById("projectsContainer");
  const projects = Array.from(
    container.getElementsByClassName("accordion-item")
  );

  projects.sort((a, b) => {
    const nameA = a.dataset.name.toLowerCase();
    const nameB = b.dataset.name.toLowerCase();

    switch (sortBy) {
      case "name-asc":
        return nameA.localeCompare(nameB, "lv"); // Pievienots 'lv' lokalizācijai
      case "name-desc":
        return nameB.localeCompare(nameA, "lv");
      case "date-desc":
      case "date-asc":
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return sortBy === "date-desc" ? dateB - dateA : dateA - dateB;
    }
  });

  // Ievieto sakārtotos projektus atpakaļ konteinerā
  const accordion = document.getElementById("projectAccordion");
  projects.forEach((project) => accordion.appendChild(project));
}


// funkcija, kas ļauj lietotājam sakārtot projektus pēc vajadzības
document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.getElementById("sortOptions");

  // Uzliek noklusējuma vērtību "Jaunākie projekti"
  sortSelect.value = "date-desc";

  // Automātiski kārto pēc jaunākajiem projektiem, kad lapa ielādējas
  sortProjects("date-desc");

  // Klausās izmaiņas, ja lietotājs maina kārtošanas veidu
  sortSelect.addEventListener("change", function () {
    sortProjects(this.value);
  });
});