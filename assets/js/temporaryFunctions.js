// labajā apakšējā ekrāna malā parāda ekrāna izmēru, lai vieglāk izsekot bootstrap izmēriem
export function getBootstrapBreakpoint() {
  const width = window.innerWidth;
  if (width < 576) return "XS"; // Extra Small
  if (width >= 576 && width < 768) return "SM"; // Small
  if (width >= 768 && width < 992) return "MD"; // Medium
  if (width >= 992 && width < 1200) return "LG"; // Large
  if (width >= 1200 && width < 1400) return "XL"; // Extra Large
  return "XXL"; // Extra Extra Large
}

export function updateScreenSize() {
  const breakpointElement = document.getElementById("breakpoint");
  if (breakpointElement) {
    breakpointElement.textContent = getBootstrapBreakpoint();
  }
}