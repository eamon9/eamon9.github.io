// Ielādē header, footer un sākumlapas saturu
async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Neizdevās ielādēt: ${file}`);
    document.getElementById(id).innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

window.onload = async function () {
  await loadComponent("header", "./components/header.html");
  await loadComponent("footer", "./components/footer.html");
  await loadContent("./pages/main.html"); // Automātiski ielādē sākumlapu

  // Pēc header ielādes inicializē dropdown un formu validāciju
  initializeDropdowns();
  initFormValidation();
};

// Funkcija, lai ielādētu sadaļu pēc izvēles
async function loadContent(page, sectionId = null) {
  const content = document.getElementById("content");
  try {
    const response = await fetch(page);
    if (!response.ok) throw new Error("Failu nevarēja ielādēt");
    const data = await response.text();
    content.innerHTML = data;

    // Pievieno validāciju pēc satura ielādes
    initFormValidation();

    // Ja ir norādīta sadaļa, uz kuru pāriet
    if (sectionId) {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({behavior: "smooth"});
      }, 100);
    }
  } catch (error) {
    content.innerHTML = `<h2>Kļūda</h2><p>${error.message}</p>`;
  }
}

// Funkcija dropdown loģikas inicializācijai
function initializeDropdowns() {
  if (window.innerWidth >= 992) {
    let dropdowns = document.querySelectorAll(".dropdown");
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
}

// Funkcija formu validācijai
function initFormValidation() {
  var forms = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });
}

// Navigācijas aktīvās klases pārvaldība
document.addEventListener("DOMContentLoaded", function () {
  let navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, .navbar-nav .dropdown-item"
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");

      let parentDropdown = this.closest(".dropdown");
      if (parentDropdown) {
        let dropdownToggle = parentDropdown.querySelector(
          ".nav-link.dropdown-toggle"
        );
        dropdownToggle.classList.add("active");
      }
    });
  });
});