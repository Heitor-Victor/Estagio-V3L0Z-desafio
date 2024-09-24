// modo escuro
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = document.body.classList.contains("dark-mode");
  if (isDarkMode) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}

// verificador do modo escuro
function checkDarkModePreference() {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }
}

document
  .getElementById("darkModeToggle")
  .addEventListener("click", toggleDarkMode);

// Carrega os detalhes do país escolhido
function loadCountryDetails() {
  const country = JSON.parse(localStorage.getItem("selectedCountry"));

  if (!country) {
    document.getElementById("countryDetails").innerHTML =
      "<p>No country data available.</p>";
    return;
  }

  const detailsContainer = document.getElementById("countryDetails");

  detailsContainer.innerHTML = `
    <h1>${country.name.official}</h1>
    <img src="${country.flags.png}" alt="Flag of ${country.name.official}">
    <p><strong>Capital:</strong> ${
      country.capital ? country.capital[0] : "N/A"
    }</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Sub-region:</strong> ${country.subregion || "N/A"}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
    <p><strong>Languages:</strong> ${Object.values(
      country.languages || {}
    ).join(", ")}</p>
    <p><strong>Currencies:</strong> ${Object.values(country.currencies || {})
      .map((c) => c.name)
      .join(", ")}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
    <p><strong>Top Level Domain:</strong> ${
      country.tld ? country.tld.join(", ") : "N/A"
    }</p>
    <p><strong>Calling Code:</strong> ${
      country.idd
        ? country.idd.root +
          (country.idd.suffixes ? + country.idd.suffixes.join(", ") : "")
        : "N/A"
    }</p>
  `;
}

// botão de retorno
document.getElementById("backButton").addEventListener("click", () => {
  window.location.href = "index.html"; // Redirect to the list page
});

// verifica se o modo escuro está selecionado no carregamento da página
checkDarkModePreference();

window.addEventListener("load", loadCountryDetails);
