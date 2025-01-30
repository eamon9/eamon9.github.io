document.addEventListener("DOMContentLoaded", function () {
  // Dropdown logic
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

  // Active class handling
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

  // Form validation
  var forms = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
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
async function loadContent(page, sectionId = null) {
  const content = document.getElementById("content");

  try {
    const response = await fetch(page);
    if (!response.ok) {
      throw new Error("Failu nevarēja ielādēt");
    }
    const data = await response.text();
    content.innerHTML = data;

    // Pārliecinies, ka formām tiek pievienota validācija
    initFormValidation();

    if (sectionId) {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({behavior: "smooth"});
        }
      }, 100);
    }
  } catch (error) {
    content.innerHTML = `<h2>Kļūda</h2><p>${error.message}</p>`;
  }
}

function initFormValidation() {
  var forms = document.querySelectorAll(".needs-validation");
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault(); // Novērš formas iesniegšanu
          event.stopPropagation(); // Aptur tālāku notikumu izpildi
        }
        form.classList.add("was-validated"); // Pievieno Bootstrap validācijas klasi
      },
      false
    );
  });
}
