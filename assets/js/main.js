import {initFormValidation} from "./formValidation.js";

function getPath(file) {
  const isGitHubPages = window.location.hostname.includes("github.io");
  const repoName = isGitHubPages ? window.location.pathname.split("/")[1] : "";

  const depth = window.location.pathname.split("/").length - 2;
  let prefix = "";

  // Ja strādā uz GitHub Pages, pievieno repozitorija nosaukumu ceļam
  if (isGitHubPages) {
    prefix = `/${repoName}/`;
  } else {
    // Ja strādā lokāli, aprēķina ceļu balstoties uz mapju dziļumu
    for (let i = 0; i < depth; i++) {
      prefix += "../";
    }
  }

  return `${prefix}components/${file}`;
}


async function loadComponent(id, file) {
  try {
    const response = await fetch(getPath(file));
    if (!response.ok) throw new Error(`Neizdevās ielādēt: ${file}`);
    document.getElementById(id).innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");

  setActiveNavLink();

  window.addEventListener("load", updateScreenSize);
  window.addEventListener("resize", updateScreenSize);

  initializeDropdowns();
  initFormValidation();
});

// Funkcija dropdown loģikas inicializācijai
function initializeDropdowns() {
  if (window.innerWidth >= 992) {
    let dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(function (dropdown) {
      let menu = dropdown.querySelector(".dropdown-menu");
      let toggle = dropdown.querySelector(".dropdown-toggle");

      // Hover uz dropdown pogas, lai atvērtu izvēlni
      dropdown.addEventListener("mouseenter", function () {
        closeAllDropdowns();
        menu.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      });

      // Hover no dropdown pogas, lai aizvērtu izvēlni
      dropdown.addEventListener("mouseleave", function () {
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      });

      // Klikšķis uz dropdown nosaukuma, lai pārietu uz attiecīgo saiti
      toggle.addEventListener("click", function (event) {
        // Pārtrauc noklusēto darbību, ja izvēlne tiek atvērta vai aizvērta
        event.preventDefault();

        // Ja linka adrese ir norādīta tieši uz nosaukuma
        let link = toggle.getAttribute("href");
        if (link) {
          window.location.href = link; // Pāriet uz saiti
        } else {
          let isOpen = menu.classList.contains("show");
          closeAllDropdowns();
          if (!isOpen) {
            menu.classList.add("show");
            toggle.setAttribute("aria-expanded", "true");
          }
        }
      });
    });

    // Aizvērt visas dropdown izvēlnes
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


// Funkcija, lai pārvaldītu aktīvo navigācijas saiti (iekļaujot footer sadaļu)
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-link, .dropdown-item, footer a");  // Iekļauj arī footer linkus
  const currentPath = window.location.pathname + window.location.hash;
  console.log("Pašreizējais ceļš:", currentPath);  // Debugging

  navLinks.forEach((link) => {
    try {
      if (!link.href || link.href === "#") {
        return;
      }

      const linkURL = new URL(link.href, window.location.origin);
      const linkPath = linkURL.pathname + linkURL.hash;

      // Pārbaudām, vai saites ceļš sakrīt ar pašreizējo ceļu
      if (linkPath === currentPath) {
        link.classList.add("active");

        // Ja aktīvais links ir dropdown-item, pievieno 'active' arī dropdown-toggle
        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          const dropdownToggle = parentDropdown.querySelector(".dropdown-toggle");
          if (dropdownToggle) {
            dropdownToggle.classList.add("active");
          }
        }

        // Papildus - Atrodam visus linkus ar šo pašu href un pievienojam tiem 'active' klasi
        document.querySelectorAll(`a[href='${link.href}']`).forEach((matchingLink) => {
          matchingLink.classList.add("active");
        });

      } else {
        link.classList.remove("active");
      }
    } catch (error) {
      console.error("Kļūda apstrādājot linku:", link, error);
    }
  });
} 
  
  // Izsaucam sākotnēji, kad lapa ielādējas
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Pievienojam klausītāju enkura maiņai (hash izmaiņām)
window.addEventListener('hashchange', setActiveNavLink);


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
  const breakpointElement = document.getElementById("breakpoint");
  if (breakpointElement) {
    breakpointElement.textContent = getBootstrapBreakpoint();
  }
}
