// Constants
const DELAY_FOR_GENERATION_SEARCH = 1000; // Delay in milliseconds for searching by generation
const requestGame = requestAllGames();
const requestName = requestPokemonListNames();

// Helper functions for setting up page-specific functionality
function setupIndexPage() {
  searchAllGenerations();
  executeAutoCompleteName(requestName);
  executeAutoCompleteGame(requestGame);
  displaySearchBarVideoGame();
}

function setupListeGenerationPage() {
  searchAllGenerations();

  executeAutoCompleteGame(requestGame);
  displaySearchBarVideoGame();

  setTimeout(searchByGeneration, DELAY_FOR_GENERATION_SEARCH);;
}

function setup404Page() {
  searchAllGenerations();
  executeAutoCompleteGame(requestGame);
  displaySearchBarVideoGame();

}

function setupJeuPage() {
  searchAllGenerations();
  searchGameByName();
  executeAutoCompleteGame(requestGame);
  displaySearchBarVideoGame();

}


function setupProfilePage() {
  const id = getIdParameter();
  console.log(id);
  if (id < 1 || id > 1017) window.location.href = "404.html";
  console.log("recherche profil");
  searchProfile().then(() => {
    console.log("recherche profil terminée");
    searchAllGenerations();
    executeAutoCompleteGame(requestGame);
  });

  setupNavigationLinks();
  setFlipCardImages();
  displaySearchBarVideoGame();

}

function setupNavigationLinks() {
  const id = parseInt(getIdParameter());
  const idPrecedentInt = id - 1;
  const idSuivantInt = id + 1;

  var left = document.getElementById("left");
  // Use a helper function to create navigation link HTML
  left.innerHTML =
    createNavigationLinkHTML(idPrecedentInt, "gauche");

  if (idPrecedentInt <= 0) {
    // make left invisible
    left.style.visibility = "hidden";
  }

  var right = document.getElementById("right");
  if (idSuivantInt >= 1018) right.style.visibility = "hidden";

  document.getElementById("right").innerHTML = createNavigationLinkHTML(idSuivantInt, "droite");
}

function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}


function createNavigationLinkHTML(id, direction) {

  const paddedId = id.toString().padStart(3, '0');
  const spriteUrl = getSpriteUrl(id);
  const directionIcons = {
    "gauche": "img/icones/icone-fleche-gauche-noir.png",
    "droite": "img/icones/icone-fleche-droite-noir.png"
  };

  var w = window.innerHeight;
  if(w > 600){
    if (direction == "gauche") {
      return `
      <a href="profil.html?id=${id}">
        <img src="${directionIcons[direction]}" alt="Flèche ${direction}">
      </a>
      <a href="profil.html?id=${id}">
        <p>Pokémon n°${paddedId}</p>
      </a>
      <a href="profil.html?id=${id}">
        <img id="pixelized-sprite" src="${spriteUrl}" alt="Pokémon ${direction === "gauche" ? "précédent" : "suivant"}">
      </a>`;
    } else {
      return `
      <a href="profil.html?id=${id}">
        <img id="pixelized-sprite" src="${spriteUrl}" alt="Pokémon ${direction === "gauche" ? "précédent" : "suivant"}">
      </a>
      <a href="profil.html?id=${id}">
        <p>Pokémon n°${paddedId}</p>
      </a>
      <a href="profil.html?id=${id}">
        <img src="${directionIcons[direction]}" alt="Flèche ${direction}">
      </a>`;
    }
  } else {
    if (direction == "gauche") {
      return `
      <div id="phone-adapted-left">
      <a href="profil.html?id=${id}">
        <img src="${directionIcons[direction]}" alt="Flèche ${direction}">
      </a>
      <a href="profil.html?id=${id}">
        <p>Pokémon n°${paddedId}</p>
      </a>
      </div>
      <a href="profil.html?id=${id}">
        <img id="pixelized-sprite" src="${spriteUrl}" alt="Pokémon ${direction === "gauche" ? "précédent" : "suivant"}">
      </a>`;
    } else {
      return `<div id="phone-adapted-right">
      <a href="profil.html?id=${id}">
        <img id="pixelized-sprite" src="${spriteUrl}" alt="Pokémon ${direction === "gauche" ? "précédent" : "suivant"}">
      </a>
      <a href="profil.html?id=${id}">
        <p>Pokémon n°${paddedId}</p>
      </a></div>
      <a href="profil.html?id=${id}">
        <img src="${directionIcons[direction]}" alt="Flèche ${direction}">
      </a>`;
    }
    
  }

  


}

// Initialization based on the current page
function init() {
  const pathname = window.location.pathname;
  window.addEventListener('load', () => {
    if (pathname.endsWith("index.html") || pathname === "/") {
      setupIndexPage();
    } else if (pathname.includes("listeGeneration.html")) {
      setupListeGenerationPage();
    } else if (pathname.includes("profil.html")) {
      setupProfilePage();
    } else if (pathname.includes("404.html")) {
      setup404Page();
    } else if (pathname.includes("jeu.html")) {
      setupJeuPage();
    }
  });
}

// Run the initialization function
init();




