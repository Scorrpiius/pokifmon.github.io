// Constants
const DELAY_FOR_GENERATION_SEARCH = 1000; // Delay in milliseconds for searching by generation


// Helper functions for setting up page-specific functionality
function setupIndexPage() {
  searchAllGenerations();
  const requestName = requestPokemonListNames();
  executeAutoCompleteName(requestName);
  const requestGame = requestAllGames();
  executeAutoCompleteGame(requestGame);
  displaySearchBarVideoGame();
}

function setupListeGenerationPage() {
  searchAllGenerations();
  setTimeout(searchByGeneration, DELAY_FOR_GENERATION_SEARCH);


}

function setup404Page() {
  searchAllGenerations();

}

function setupJeuPage(){
  searchAllGenerations();
  searchGameByName();

}


function setupProfilePage() {
  const id = getIdParameter();
  console.log(id);
  if (id < 1 || id > 1017) window.location.href = "404.html";
  searchProfile();
  setupNavigationLinks();
  setFlipCardImages();
  setTimeout(searchAllGenerations, DELAY_FOR_GENERATION_SEARCH);

}

function setupNavigationLinks() {
  const id = parseInt(getIdParameter());
  const idPrecedentInt = id - 1;
  const idSuivantInt = id + 1;

  var left = document.getElementById("left");
  // Use a helper function to create navigation link HTML
  left.innerHTML = 
  createNavigationLinkHTML(idPrecedentInt, "gauche");

  if(idPrecedentInt <= 0){
    // make left invisible
    left.style.visibility = "hidden";
  }
  
  document.getElementById("right").innerHTML = createNavigationLinkHTML(idSuivantInt, "droite");
}

function getSpriteUrl(id){
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}


function createNavigationLinkHTML(id, direction) {
  const paddedId = id.toString().padStart(3, '0');
  const spriteUrl = getSpriteUrl(id);
  const directionIcons = {
    "gauche": "img/icones/icone-fleche-gauche-noir.png",
    "droite": "img/icones/icone-fleche-droite-noir.png"
  };

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
    } else if (pathname.includes("jeu.html")){
      setupJeuPage();
    }
  });
}

// Run the initialization function
init();




