function displayResultGame(data){

  data.results.bindings.forEach(r =>{
    console.log(r);
    var name = document.getElementById("game-name");
    name.innerHTML = r.name?.value;

    var description = document.getElementById("game-description");
    description.innerHTML = r.description?.value;
    setElementText("game-release-date", "Date de sortie", r.date?.value);
    setElementText("game-developer", "Développeur", r.developerName?.value);
    setElementText("game-console", "Plate-forme(s)", r.console?.value);
    setElementText("game-modes", "Mode(s) de jeu", r.modesName?.value);
    setElementText("game-designer", "Désigner(s)", r.designer?.value + r.designerName?.value);
    setElementText("game-producer", "Producteur", r.producer?.value + r.producerName?.value);
    setElementText("game-programmer", "Programmeur", r.programmer?.value + r.programmerName?.value);
    setElementText("game-type", "Genre", r.typeName?.value);
    setElementText("game-director", "Directeur(s)", r.directorName?.value);
  });
  
  
}


function displayResultsGeneration(data) {
  var container = document.getElementById("generation-select");
  var form = `<ul>`;

  data.results.bindings.forEach((r) => {
    var generation = r.generation.value;
    var lien = `<li><a href="listeGeneration.html?id=${r.ordre.value}"> ${generation[21].toUpperCase() + generation.slice(22, generation.length)}</a></li>`;
    form += lien;

  });
  form += `</ul>`;
  container.innerHTML += form;
}

function displaySearchBarVideoGame(){
  var container = document.getElementById("video-game");

  var form = `<div id="game-search-bar" class="form-group has-search"> <span class="fa fa-search form-control-feedback"> <i class="gg-search"></i> </span> <div class="autocomplete"> <input id="requete-nom-jeu" type="text" class="form-control" placeholder="Rechercher par nom..." > </div></div>`;
  container.innerHTML += form;
}



// Affichage les résultats de la recherche dans une grille de "pokecards"
function displayResultsMenu(data) {
  var container = document.querySelector(".container-pokecards");
  container.innerHTML = "";

  // Ajouter chaque pokemon dans une card
  data.results.bindings.forEach((r) => {
    var types = r.types.value.split(";");

    var typesFiltered = types.filter(function(element) {
      return element.includes("Pokémon de type ");
    }).map(function(element) {
      return element.replace("Pokémon de type ", "");
    });

    addPokeCard(r.pokedexNumber.value, r.pokemonLabel.value, typesFiltered);
  });

  // Afficher le nombre de résultats
  var resultsNumber = document.getElementById("results-number");
  var resultCount = data.results.bindings.length;
  var resultText = resultCount === 1 ? 'résultat trouvé' : 'résultats trouvés';
  resultsNumber.innerHTML = `
    <div class="card no-shadow">
      <div class="card-body">
        <h2 class="card-title results-number">${resultCount} ${resultText}.</h2>
      </div>
    </div>
  `;
}

/**
 * Sets the inner HTML of an element with a provided value, prefixed by a label and optionally suffixed by additional text.
 * If the provided value is falsy, the element's content is not modified.
 *
 * @param {string} selector - The ID of the DOM element to set the text for.
 * @param {string} label - The label text to prefix the value with.
 * @param {string|null} value - The value to be displayed. If this is null or undefined, the function will do nothing.
 * @param {string} [postfix=""] - Optional text to append after the value.
 */
function setElementText(selector, label, value, postfix = "") {
  let element = document.getElementById(selector);
  if (value) {
    element.innerHTML = `<strong>${label}:</strong> ${value}${postfix}`;
  }
}


/**
 * Processes the results from a Wikidata SPARQL query and updates the DOM elements
 * with the relevant Pokémon data such as name, Pokédex number, type, size, color, mass, generation, previous and next evolution, and gender. 
 *
 * @param {Object} data - The response object from a Wikidata SPARQL query.
 */
function displayResultsProfile(data) {
  let nom = document.getElementById("nom");

  data.results.bindings.forEach(r => {
    if (r["pokemonLabel"]) {
      nom.innerHTML = r["pokemonLabel"].value;
    }
    setElementText("id", "Pokémon n°", r.pokedexNumber?.value);
    setElementText("type", "Type(s)", r.types?.value);
    display_faiblesses_forces(r.types?.value);

    if (!isNaN(r.taille?.value)) { // verifying if the size is a valid number
      var unit = r.taille?.value >= 10 ? " centimètres" : " mètres";
      setElementText("taille", "Taille", r.taille?.value, unit);
    }

    setElementText("couleur", "Couleur", r.couleurLabel?.value);
    setElementText("masse", "Masse", r.masse?.value, " kg");
    setElementText("generation", "Génération", r.genLabel?.value);



    // Handle evolutions
    let hasPrevEvolution = r.preLab?.value.length != 0;
    let hasNextEvolution = r.suiLab?.value.length != 0;
    setElementText("evolu-prec", "Evolution précédente", r.preLab?.value);
    setElementText("evolu-suiv", "Evolution suivante", r.suiLab?.value);

    if (!hasPrevEvolution && !hasNextEvolution) {
      document.getElementById("evolu-suiv").innerHTML = "<strong>Pas d'évolution</strong>";
    }

    setElementText("genre", "Genre", r.genderLabel?.value);
  });
}

function extractTypes(pokemonArray) {
  const result = pokemonArray.map(pokemon => {
    const typeMatch = pokemon.match(/Pokémon de type (.*)/);
    return typeMatch ? typeMatch[1] : null;
  });

  // Filtrer les valeurs nulles (cas où le type n'a pas été trouvé)
  console.log(result.filter(type => type !== null));
  return result.filter(type => type !== null);
}

function display_faiblesses_forces(pokemon_types) {
  var typesArray = pokemon_types.split(";");
  let contenu_requete = extractTypes(typesArray);
  var matrix = creationMatriceType();

  let faiblesses = requete_faiblesses(matrix, contenu_requete);
  let forces = requete_forces(matrix, contenu_requete);
  let resultats_faiblesses = document.getElementById("faiblesses");
  let resultats_forces = document.getElementById("forces");

  for (let i = 0; i < faiblesses.length; i++) {
    const img = "<img src='img/types/";
    faiblesses[i] = img.concat(faiblesses[i], ".png' height='16px'></img>");
  }
  for (let i = 0; i < forces.length; i++) {
    const img = "<img src='img/types/";
    forces[i] = img.concat(forces[i], ".png' height='16px'></img>");
  }

  resultats_faiblesses.innerHTML = faiblesses;
  resultats_forces.innerHTML = forces;
}



