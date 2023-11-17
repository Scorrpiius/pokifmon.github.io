function searchByPokedexID(input) {
  // Utilise isNaN pour vérifier si l'entrée n'est pas un nombre
  if (isNaN(input.value)) {
    alert("Veuillez entrer un nombre valide.");
    input.value = "";
  } else {
    uncheckTousRadio();
    clearSearchByName();
    console.log("Recherche POKEDEXID en cours");
    var contenu_requete = document.getElementById("requete-pokedexid").value;

    if (contenu_requete.length == 0) {
      var request = requestPokemonList();
    } else {
      var number = parseInt(contenu_requete);
      var request = requestPokemonByPokedexID(number);
    }
    executeWikidataRequest(request, displayResultsMenu);
  }
}


function searchProfile() {
  return new Promise((resolve) => {
    console.log("Recherche profil en cours");

    var id = getIdParameter();
    var request = requestPokemonProfile(id);

    // Passer la fonction resolve comme callback à executeWikidataRequest
    executeWikidataRequest(request, (results) => {
      displayResultsProfile(results);
      resolve(); // Appeler resolve une fois que executeWikidataRequest est terminé
    });
  });
}


function searchByGeneration() {
    console.log("Recherche générations en cours")

    var id = getIdParameter();
    let generation = null
    switch (id) {
      case '1':
        generation = "Generation I";
        break;

      case '2':
        generation = "Generation II";
        break;

      case '3':
        generation = "Generation III";
        break;

      case '4':
        generation = "Generation IV";
        break;

      case '5':
        generation = "Generation V";
        break;

      case '6':
        generation = "Generation VI";
        break;

      case '7':
        generation = "Generation VII";
        break;

      case '8':
        generation = "Generation VIII";
        break;

      case '9':
        generation = "Generation IX";
        break;

    }
    document.getElementById("en-tete").innerHTML = `Pokémon de la ${generation}`

    var request = requestPokemonByGeneration(generation);
    console.log(request);
    
    // Utiliser le callback de executeWikidataRequest pour résoudre la promesse
    executeWikidataRequest(request, displayResultsMenu);

}

function searchAllGenerations() {
    console.log("Recherche des générations existantes en cours");

    var request = requestAllGenerations();
    executeWikidataRequest(request, displayResultsGeneration);
}

function searchByName() {
  uncheckTousRadio();
  clearSearchByPokedexID();
  console.log("Recherche en cours");
  var contenu_requete = document.getElementById("requete-nom").value;

  var request;
  if (contenu_requete.length == 0) {
    request = requestPokemonList();
  } else {
    request = requestPokemonByName(contenu_requete);
  }
  executeWikidataRequest(request, displayResultsMenu);

}

function searchType() {
  clearSearchByPokedexID();
  clearSearchByName();
  console.log("Recherche TYPE en cours");

  var selectedOption = document.querySelector('input[name="types"]:checked');

  if (selectedOption) {
    var selectedValue = selectedOption.id;
    console.log("Option sélectionnée : ", selectedValue);

    // Faites quelque chose avec la valeur sélectionnée, par exemple, envoyez-la à une autre fonction ou à un serveur


    var request = requestPokemonByType(selectedValue);
    executeWikidataRequest(request, displayResultsMenu);
  } else {
    console.log("Aucune option sélectionnée");
    alert("Veuillez sélectionner un type.");
  }

}

function searchGameByName() {
  console.log("Recherche infos sur le jeu en cours");

  var name = getNameParameter();
  name = name.replaceAll(" ", "_");

  var request = requestInfosByGame(name);
  executeDBPediaRequest(request, displayResultGame);

}
