import {initFormValidation} from "./formValidation.js";

function adjustPaths() {
  const currentPath = window.location.pathname;

  const isGitHubPages = window.location.hostname === "eamon9.github.io";
  const isNewRepoSubfolder = currentPath.includes("/grannies-club/");

  let basePath = "./";
  if (isGitHubPages && isNewRepoSubfolder) {
    basePath = "/grannies-club/";
  } else if (currentPath.includes("/pages/")) {
    basePath = "../";
  }

  document.querySelectorAll("img").forEach((img) => {
    let src = img.getAttribute("src");
    if (img.closest("header")) {
      img.src = src;
    } else {
      if (
        src &&
        !src.startsWith("http") &&
        !src.startsWith("/") &&
        !src.startsWith("assets/images/")
      ) {
        img.src = "assets/images/" + src;
      } else if (
        src &&
        !src.startsWith("http") &&
        src.startsWith("assets/images/")
      ) {
        img.src = basePath + src;
      }
    }
  });

  document.querySelectorAll("a").forEach((link) => {
    let href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      if (href.startsWith("pages/")) {
        link.href = basePath + href;
      }
    }
  });
}

function getPath(file) {
  const isGitHubPages = window.location.hostname === "eamon9.github.io";
  const basePath = isGitHubPages ? "/grannies-club/" : "/";

  return `${basePath}components/${file}`;
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
        let link = toggle.getAttribute("href");
        if (link) {
          window.location.href = link;
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

function setActiveNavLink() {
  const navLinks = document.querySelectorAll(
    ".nav-link, .dropdown-item, footer a"
  );
  const currentPath = window.location.pathname + window.location.hash;

  navLinks.forEach((link) => {
    try {
      if (!link.href || link.href === "#") {
        return;
      }

      const linkURL = new URL(link.href, window.location.origin);
      const linkPath = linkURL.pathname + linkURL.hash;

      if (linkPath === currentPath) {
        link.classList.add("active");

        const parentDropdown = link.closest(".dropdown");
        if (parentDropdown) {
          const dropdownToggle =
            parentDropdown.querySelector(".dropdown-toggle");
          if (dropdownToggle) {
            dropdownToggle.classList.add("active");
          }
        }

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

document.addEventListener("DOMContentLoaded", async function () {
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");

  setActiveNavLink();

  window.addEventListener("load", updateScreenSize);
  window.addEventListener("resize", updateScreenSize);

  adjustPaths();
  initializeDropdowns();
  initFormValidation();
});

function getBootstrapBreakpoint() {
  const width = window.innerWidth;
  if (width < 576) return "XS";
  if (width >= 576 && width < 768) return "SM";
  if (width >= 768 && width < 992) return "MD";
  if (width >= 992 && width < 1200) return "LG";
  if (width >= 1200 && width < 1400) return "XL";
  return "XXL";
}

function updateScreenSize() {
  const breakpointElement = document.getElementById("breakpoint");
  if (breakpointElement) {
    breakpointElement.textContent = getBootstrapBreakpoint();
  }
}

document.addEventListener("DOMContentLoaded", adjustPaths);
