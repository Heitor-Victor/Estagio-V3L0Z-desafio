const API_URL = "https://restcountries.com/v3.1/all";
let countriesData = [];
let filteredCountries = [];
let currentIndex = 0;
const ITEMS_PER_PAGE = 20;

// função do clique em um país
function CountryClick(country) {
  localStorage.setItem("selectedCountry", JSON.stringify(country)); // armazena o país selecionado
  window.location.href = "details.html"; // redireciona para a página de detalhes
}

// Modo escuro
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

// Carregamento da lista de países
function loadMoreCountries() {
  const countryList = document.getElementById("countryList");
  const nextIndex = currentIndex + ITEMS_PER_PAGE;

  const countriesToDisplay = filteredCountries.slice(currentIndex, nextIndex);
  countriesToDisplay.forEach((country) => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("country-card");

    countryCard.innerHTML = `
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <h3>${country.name.common}</h3>
      <p>Capital: ${country.capital ? country.capital[0] : "N/A"}</p>
      <p>Region: ${country.region}</p>
    `;

    countryCard.addEventListener("click", () => CountryClick(country)); // chama a função do clique no card
    countryList.appendChild(countryCard);
  });

  currentIndex = nextIndex;
}

// função para ordenar os países alfabeticamente, por população e por área
function sortCountries() {
  const sortValue = document.getElementById("sortFilter").value;

  switch (sortValue) {
    case "name-asc":
      filteredCountries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      break;
    case "name-desc":
      filteredCountries.sort((a, b) =>
        b.name.common.localeCompare(a.name.common)
      );
      break;
    case "population-asc":
      filteredCountries.sort((a, b) => a.population - b.population);
      break;
    case "population-desc":
      filteredCountries.sort((a, b) => b.population - a.population);
      break;
    case "area-asc":
      filteredCountries.sort((a, b) => a.area - b.area);
      break;
    case "area-desc":
      filteredCountries.sort((a, b) => b.area - a.area);
      break;
    default:
      break;
  }

  currentIndex = 0;
  document.getElementById("countryList").innerHTML = "";
  loadMoreCountries();
}

// adicionando as sub regiões de acordo com a região
function populateSubRegions(region) {
  const subRegionFilter = document.getElementById("subRegionFilter");
  subRegionFilter.innerHTML = '<option value="">Filter by Sub-region</option>'; // limpa opções anteriores

  if (!region) return;

  const subRegions = [
    ...new Set(
      countriesData
        .filter((country) => country.region === region && country.subregion)
        .map((country) => country.subregion)
    ),
  ];

  subRegions.forEach((subRegion) => {
    const option = document.createElement("option");
    option.value = subRegion;
    option.textContent = subRegion;
    subRegionFilter.appendChild(option);
  });
}

// filtros de região, sub região, população e pesquisa
function filterCountries() {
  const region = document.getElementById("regionFilter").value;
  const subRegion = document.getElementById("subRegionFilter").value;
  const population = document.getElementById("populationFilter").value;
  const query = document.getElementById("searchInput").value.toLowerCase();

  currentIndex = 0;
  const countryList = document.getElementById("countryList");
  countryList.innerHTML = ""; // limpa lista anterior

  filteredCountries = countriesData.filter((country) => {
    let matches = true;

    // pesquisa
    if (query && !country.name.common.toLowerCase().includes(query))
      matches = false;

    // região
    if (region && country.region !== region) matches = false;

    // sub região
    if (subRegion && country.subregion !== subRegion) matches = false;

    // população
    const populationValue = country.population;
    if (population) {
      if (population === "<1000000" && populationValue >= 1000000)
        matches = false;
      else if (
        population === "1000000-10000000" &&
        (populationValue < 1000000 || populationValue > 10000000)
      )
        matches = false;
      else if (
        population === "10000000-100000000" &&
        (populationValue < 10000000 || populationValue > 100000000)
      )
        matches = false;
      else if (population === ">100000000" && populationValue <= 100000000)
        matches = false;
    }

    return matches;
  });

  sortCountries();
}

// Mostrar o botão quando o usuário rolar para baixo
window.addEventListener("scroll", () => {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  if (window.scrollY > 300) { // Exibe o botão após descer 300px
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

// Voltar para o topo ao clicar no botão
document.getElementById("scrollToTopBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" }); // Rola suavemente até o topo
});


// evento para preencher as sub regiões quando uma região é selecionada
document.getElementById("regionFilter").addEventListener("change", (e) => {
  populateSubRegions(e.target.value); // atualiza
  filterCountries(); // aplica filtros
});

document
  .getElementById("subRegionFilter")
  .addEventListener("change", filterCountries);
document
  .getElementById("populationFilter")
  .addEventListener("change", filterCountries);
document
  .getElementById("searchInput")
  .addEventListener("input", filterCountries);
document
  .getElementById("sortFilter")
  .addEventListener("change", filterCountries);

// Busca os dados na API, inicializa a lista e os filtros
async function fetchCountries() {
  try {
    const response = await fetch(API_URL);
    countriesData = await response.json();
    filteredCountries = countriesData; // começa com tudo
    sortCountries(); // ordena inicialmente
    loadMoreCountries();
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

// verifica se o modo escuro está ativo
checkDarkModePreference();

// scroll infinto
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMoreCountries();
  }
});

fetchCountries();
