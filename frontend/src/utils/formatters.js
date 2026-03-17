export function formatEnumLabel(value) {
  return String(value || "")
    .replace(/^ROLE_/, "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function dashboardRouteForRole(role) {
  if (role === "ROLE_ADMIN") return "/admin";
  if (role === "ROLE_OFFICER") return "/officer";
  return "/citizen";
}
