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
  await loadContent("./pages/main.html");

  // Pēc header ielādes inicializē dropdown un formu validāciju
  initializeDropdowns();
  initFormValidation();

  // Pārvalda aktīvo klasi pēc ielādes (arī footer)
  setActiveNavLink();
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

    // Pārvalda aktīvo klasi pēc ielādes
    setActiveNavLink();

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

// Funkcija, lai pārvaldītu aktīvo navigācijas saiti (iekļaujot footer sadaļu)
function setActiveNavLink() {
  // Atlasām visus linkus gan navbar, gan footer sadaļās
  let navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, .navbar-nav .dropdown-item, .footer-nav .nav-link, .footer-nav .dropdown-item"
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Noņemam 'active' klasi no visām saitēm
      navLinks.forEach((nav) => nav.classList.remove("active"));
      
      // Pievienojam 'active' klasi izvēlētajai saitei
      this.classList.add("active");

      // Pārbaudām, vai ir dropdown, un pievienojam 'active' klasei arī tās toggle pogai
      let parentDropdown = this.closest(".dropdown");
      if (parentDropdown) {
        let dropdownToggle = parentDropdown.querySelector(
          ".nav-link.dropdown-toggle"
        );
        if (dropdownToggle) {
          dropdownToggle.classList.add("active");
        }
      }
    });
  });
}

// labajā apakšējā ekrāna malā parāda ekrāna izmēru, lai vieglāk izsekot bootstrap izmēriem
function getBootstrapBreakpoint() {
  const width = window.innerWidth;
  if (width < 576) return "XS"; // Extra Small
  if (width >= 576 && width < 768) return "SM"; // Small
  if (width >= 768 && width < 992) return "MD"; // Medium
  if (width >= 992 && width < 1200) return "LG"; // Large
  if (width >= 1200 && width < 1400) return "XL"; // Extra Large
  return "XXL"; // Extra Extra Large
}

function updateScreenSize() {
  document.getElementById("breakpoint").textContent = getBootstrapBreakpoint();
}

// Atjauno sākotnēji un pie loga izmēra maiņas
window.addEventListener("load", updateScreenSize);
window.addEventListener("resize", updateScreenSize);
