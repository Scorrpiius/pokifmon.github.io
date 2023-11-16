function loadingProfile() {
  document.getElementById("loader").style.display = "block";
}

function endLoading() {
  document.getElementById("loader").style.display = "none";
}

function getIdParameter() {
  var str = window.location.href;
  var url = new URL(str);
  var id = url.searchParams.get("id");
  return id;
}

function getNameParameter(){
  var str = window.location.href;
  var url = new URL(str);
  var name = url.searchParams.get("name");
  return name;
}


function setFlipCardImages() {
  var id = getIdParameter();

  var normalUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  var shinylUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;


  var normalImg = document.getElementById("flip-card-front");
  var shinyImg = document.getElementById("flip-card-back");

  normalImg.innerHTML = `<img class="pokemon" src=${normalUrl} alt="Version normale">`;
  shinyImg.innerHTML = `<img class="pokemon" src=${shinylUrl} alt="Version Shiny">`;
}

function uncheckTousRadio() {
  // Récupère tous les éléments radio avec le nom "types"
  let radioButtons = document.querySelectorAll('input[name="types"]');

  // Désélectionne tous les éléments radio
  radioButtons.forEach(radio => {
    radio.checked = false;
  });
}

function clearSearchByName() {
  // Récupère l'élément input par son ID
  let inputRecherche = document.getElementById('requete-nom');

  // Efface la valeur de l'élément input
  inputRecherche.value = '';

}

function clearSearchByPokedexID() {
  // Récupère l'élément input par son ID
  let inputRecherche = document.getElementById('requete-pokedexid');

  // Efface la valeur de l'élément input
  inputRecherche.value = '';

}

function executeWikidataRequest(request, resultsHandler) {
  var url = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(request) + "&format=json";


  if (window.xmlhttp) {
    console.log("ANNULATION D'UNE REQUETE PAS FINIE");
    window.xmlhttp.abort();
  }

  if ((!(window.location.pathname.includes("profil.html")) && resultsHandler == displayResultsMenu) || (window.location.pathname.includes("listeGeneration.html"))) loadingCards();
  else loadingProfile();
  window.xmlhttp = new XMLHttpRequest();
  window.xmlhttp.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var results = JSON.parse(this.responseText);
      console.log(results);
      resultsHandler(results);
      window.xmlhttp = null; // on réinitialise l'objet XMLHttpRequest lorsque la requête est finie
      endLoading();
    }
  };
  window.xmlhttp.open("GET", url, true);
  window.xmlhttp.send();
}


function executeDBPediaRequest(request, resultsHandler) {

  var prefixes = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX : <http://dbpedia.org/resource/>
    PREFIX dbpedia2: <http://dbpedia.org/property/>
    PREFIX dbpedia: <http://dbpedia.org/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX onto: <http://dbpedia.org/ontology/>
    \n
     `
  if (window.xmlhttp) {
    console.log("ANNULATION D'UNE REQUETE PAS FINIE");
    window.xmlhttp.abort();
  }
 
  var url = "https://dbpedia.org/sparql?query="   + encodeURIComponent(prefixes + request) + "&format=json";
  loadingProfile();
  window.xmlhttp = new XMLHttpRequest();
  window.xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);
      resultsHandler(result);
      window.xmlhttp = null; 
      endLoading()
      }
  };
  window.xmlhttp.open("GET", url, true);
  window.xmlhttp.send();
}
