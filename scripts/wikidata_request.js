function executeWikidataRequest(request, resultsHandler) {
  var url = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(request) + "&format=json";

  if (window.xmlhttp) {
    // console.log("ANNULATION D'UNE REQUETE PAS FINIE");
    window.xmlhttp.abort();
  }

  if (( !(window.location.pathname.includes("profil.html")) && resultsHandler == displayResultsMenu) || (window.location.pathname.includes("listeGeneration.html"))) loadingCards();
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
