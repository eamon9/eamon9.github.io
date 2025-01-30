
// Tiklīdz pelīte uziet virsū dropdown menu, tā tas atveras automātiski bez spiešanas
// Kā arī pelītei noejot nost, automātiski dropdown aizveras
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth >= 992) {
    let dropdowns = document.querySelectorAll(".dropdown"); // ".nav-item.dropdown"

    dropdowns.forEach(function (dropdown) {
      let menu = dropdown.querySelector(".dropdown-menu");
      let toggle = dropdown.querySelector(".dropdown-toggle");

      dropdown.addEventListener("mouseenter", function () {
        closeAllDropdowns();
        menu.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      });

      dropdown.addEventListener("mouseleave", function () {
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      });

      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        let isOpen = menu.classList.contains("show");
        closeAllDropdowns();
        if (!isOpen) {
          menu.classList.add("show");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    });

    function closeAllDropdowns() {
      dropdowns.forEach(function (d) {
        let m = d.querySelector(".dropdown-menu");
        let t = d.querySelector(".dropdown-toggle");
        m.classList.remove("show");
        t.setAttribute("aria-expanded", "false");
      });
    }
  }
});

// atverot mājaslapu, automātiski ielādējas main lapa content sadaļā
window.onload = function () {
  fetch("./pages/main.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("content").innerHTML = data;
    })
    .catch((error) => console.error("Error loading content:", error));
};

// MAIN lapā content sadaļā ielādē nepieciešamo sadaļu, atkarībā no user izvēles
function loadContent(page, sectionId = null) {
  const content = document.getElementById("content");

  // Fetch ielādē HTML failu
  fetch(page)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failu nevarēja ielādēt");
      }
      return response.text(); // Pārveido atbildi par tekstu
    })
    .then((data) => {
      content.innerHTML = data; // Aizvieto saturu ar ielādēto failu

      // Ja ir norādīts sadaļas ID, pēc ielādes ritinam uz to
      if (sectionId) {
        setTimeout(() => {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({behavior: "smooth"});
          }
        }, 100); // Neliels aizkavējums, lai pārliecinātos, ka saturs ir ielādēts
      }
    })
    .catch((error) => {
      content.innerHTML = "<h2>Kļūda</h2><p>" + error.message + "</p>"; // Ja ir kļūda
    });
}