import {initFormValidation} from "./formValidation.js";
import {scrollToTop, toggleScrollButton} from "./additionalFunc.js";

// Funkcija, lai ielādētu komponentus (header un footer)
async function loadComponent(id, file) {
  try {
    const response = await fetch(`/components/${file}`);
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
          if (link.startsWith("#")) {
            // Ja saite ir ID (iekšējā navigācija), ritinām līdz sadaļai
            const target = document.querySelector(link);
            if (target) {
              setTimeout(() => {
                target.scrollIntoView({behavior: "smooth"});
              }, 500);
            }
          } else {
            // Ja ir ārējā saite, pārejam uz to
            window.location.href = link;
          }
        } else {
          let isOpen = menu.classList.contains("show");
          closeAllDropdowns();
          if (!isOpen) {
            menu.classList.add("show");
            toggle.setAttribute("aria-expanded", "true");
          }
        }
      });

      // Pārbaude, vai ir pieejami dropdown-item elementi
      let dropdownItems = dropdown.querySelectorAll(".dropdown-item");
      console.log(`Dropdown items: ${dropdownItems.length}`); // Apskatīsim, vai mēs atradām itemus

      dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
          // Noņem 'active' klasi no visiem citiem itemiem
          dropdownItems.forEach(function (i) {
            i.classList.remove("active");
          });

          // Pievieno 'active' klasi noklikšķinātajam item
          item.classList.add("active");
        });
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
  // Ielādējam header, footer komponentes
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");

  // Pievienojam scroll-to-top funkcionalitāti banerim
  const banner = document.getElementById("scroll-to-top");
  if (banner) {
    banner.addEventListener("click", scrollToTop);
  }

  setActiveNavLink();
  initializeDropdowns();
  initFormValidation();

  // Pēc lapas ielādes, ja URL ir #id, ritinām līdz attiecīgajai sadaļai
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }
  }
});

window.onload = function () {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }
  }
};

// Attēlu karuselis ar aprakstiem
const captionsForTETE = [
  "'Teaching English to Elderly' (TETE) nodarbība",
  "'Teaching English to Elderly' (TETE) Rīgas grupa saņēmusi APLIECĪBAS  - projekts noslēdzies, bet mācīšanās turpināsies!",
  "Every word learned opens a new door!",
  "Pēc projekta darba grupas apspriedes ar Lietuvas partneriem skaistajā ēkā 'Ola Fondation'",
  "B-bas 'Vecmāmiņas.lv' Erasmus+ TETE noslēguma konferences dalībnieki 2024.gada vasarā.",
];

const captionsForFlexibli = [
  "Draudzības vakars Islandē bija iespaidīgs – kursu dalībnieki no 9 valstīm",
  "Draudzības vakars Islandē bija iespaidīgs – kursu dalībnieki no 9 valstīm",
  "Kursi beigušies sertifikāti un dāvanas saņemtas – grupa no Latvijas",
  "Nodarbība pie vienas no pasniedzējām - radoša, atraktīva! <br>Apguvām ļoti noderīgas metodes (gan bērnu, gan pieaugušo izglītošanas procesam).",
];

const captionsForInovation = [
  "Ziedojums Ukrainai",
  "Vēstures diena. Nodarbība un lekcija Valmieras muzejā - De Woldemer",
  "Aptaujā piedalījās 48 respondenti.",
  "Brīvprātīgo diena",
  "Valodas diena",
];

// Vispārīga funkcija, kas maina tekstu atkarībā no attēla
function changeCarouselText(carouselId, captionsArray) {
  $(`#${carouselId}`).on("slid.bs.carousel", function (event) {
    const index = event.to;
    document.getElementById(
      carouselId.replace("galleryCarousel", "carouselText")
    ).innerHTML = captionsArray[index];
  });
}

window.addEventListener("scroll", toggleScrollButton);

changeCarouselText("galleryCarouselTETE", captionsForTETE);
changeCarouselText("galleryCarouselFlexibli", captionsForFlexibli);
changeCarouselText("galleryCarouselInovation", captionsForInovation);
