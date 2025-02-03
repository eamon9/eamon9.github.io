import {initFormValidation} from "./formValidation.js";

// Funkcija attēlu un saišu ceļu pielāgošanai atkarībā no pašreizējās lapas
/* function adjustPaths() {
  const currentPath = window.location.pathname;

  // Pārbauda, vai esam GitHub Pages apakšmapē
  const isGitHubPages = window.location.hostname === "eamon9.github.io";
  const isGranniesSubfolder = currentPath.includes("/grannies/");

  // Iestata bāzes ceļu attēliem
  let basePath = "./";
  if (isGitHubPages && isGranniesSubfolder) {
    basePath = "/grannies/";
  } else if (currentPath.includes("/pages/")) {
    basePath = "../";
  }

  // Pielāgo attēlu ceļus
  document.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http")) {
      img.src =
        basePath + src.replace(/^(\.\/)?assets\/images\//, "assets/images/");
    }
  });

  // Pielāgo saišu ceļus
  document.querySelectorAll("a").forEach((link) => {
    let href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      if (href.endsWith("index.html")) {
        link.href = basePath + "index.html";
      } else if (href.startsWith("pages/")) {
        link.href = basePath + href;
      }
    }
  });
} */

function adjustPaths() {
  const currentPath = window.location.pathname;

  // Pārbauda, vai esam GitHub Pages apakšmapē
  const isGitHubPages = window.location.hostname === "eamon9.github.io";
  const isGranniesSubfolder = currentPath.includes("/grannies/");

  // Iestata bāzes ceļu attēliem
  let basePath = "./";
  if (isGitHubPages && isGranniesSubfolder) {
    basePath = "/grannies/";
  } else if (currentPath.includes("/pages/")) {
    basePath = "../";
  }

  // Pielāgo attēlu ceļus
  document.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http")) {
      img.src =
        basePath + src.replace(/^(\.\/)?assets\/images\//, "assets/images/");
    }
  });

  // Pielāgo saišu ceļus
  document.querySelectorAll("a").forEach((link) => {
    let href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      if (href.endsWith("index.html")) {
        link.href = basePath + "index.html";
      } else if (href.startsWith("pages/")) {
        link.href = basePath + href;
      }
    }
  });
}

// Funkcija, lai iegūtu pareizu ceļu, ņemot vērā dziļumu un GitHub Pages apakšmapi
/* function getPath(file) {
  const isGitHubPages = window.location.hostname === "eamon9.github.io";
  const basePath = isGitHubPages ? "/grannies/" : "/";

  const depth = window.location.pathname.split("/").filter(Boolean).length;
  let prefix = "";

  if (!isGitHubPages) {
    // Ja strādājam lokāli, atgriežamies atkarībā no direktorijas dziļuma
    prefix = "../".repeat(depth - 1);
  }

  return `${prefix}components/${file}`;
} */

function getPath(file) {
  const isGitHubPages = window.location.hostname === "eamon9.github.io";
  const basePath = isGitHubPages ? "/grannies/" : "/";

  return `${basePath}components/${file}`;
}

// Funkcija, lai ielādētu komponentus (header un footer)
/* async function loadComponent(id, file) {
  try {
    const response = await fetch(getPath(file));
    if (!response.ok) throw new Error(`Neizdevās ielādēt: ${file}`);
    document.getElementById(id).innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
} */

async function loadComponent(id, file) {
  try {
    const response = await fetch(getPath(file));
    if (!response.ok) throw new Error(`Neizdevās ielādēt: ${file}`);
    document.getElementById(id).innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

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
        event.preventDefault();

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
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-item, footer a"
  ); // Iekļauj arī footer linkus
  const currentPath = window.location.pathname + window.location.hash;

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
          const dropdownToggle =
            parentDropdown.querySelector(".dropdown-toggle");
          if (dropdownToggle) {
            dropdownToggle.classList.add("active");
          }
        }

        // Papildus - Atrodam visus linkus ar šo pašu href un pievienojam tiem 'active' klasi
        document
          .querySelectorAll(`a[href='${link.href}']`)
          .forEach((matchingLink) => {
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
document.addEventListener("DOMContentLoaded", async function () {
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");

  setActiveNavLink();

  window.addEventListener("load", updateScreenSize);
  window.addEventListener("resize", updateScreenSize);

  initializeDropdowns();
  initFormValidation();
});

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

// Pārliecinies, ka skripts izpildās pēc DOM ielādes
document.addEventListener("DOMContentLoaded", adjustPaths);
