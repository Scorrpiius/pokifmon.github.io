function requestAllGames(){
    return `SELECT DISTINCT ?gameName WHERE {
        {<http://dbpedia.org/resource/Category:Pokémon_video_games> ?property ?hasValue }
        UNION
        {?isValueOf ?property <http://dbpedia.org/resource/Category:Pokémon_video_games>; rdfs:label ?gameName}
        
        FILTER(lang(?gameName)='en')
        }
        OFFSET 5
        LIMIT 31`

}

function requestInfosByGame(game){
    return `SELECT ?name  ?description ?date 
    (GROUP_CONCAT(DISTINCT ?director; SEPARATOR=' | ') AS ?director)
    (GROUP_CONCAT(DISTINCT ?directorName ; SEPARATOR=' | ') AS ?directorName)
    (GROUP_CONCAT(DISTINCT ?modesName; SEPARATOR =' | ') AS ?modesName)
    (GROUP_CONCAT(DISTINCT ?designerName ; SEPARATOR =' | ') AS ?designerName)
    (GROUP_CONCAT(DISTINCT ?designer2; SEPARATOR =' | ') AS ?designer2)
    (GROUP_CONCAT(DISTINCT ?console; SEPARATOR =' | ') AS ?console)  
    (GROUP_CONCAT(DISTINCT ?producer; SEPARATOR =' | ') AS ?producer)
    (GROUP_CONCAT(DISTINCT ?producerName; SEPARATOR =' | ') AS ?producerName)
    (GROUP_CONCAT(DISTINCT ?developerName; SEPARATOR =' | ') AS ?developerName) 
    (GROUP_CONCAT(DISTINCT ?programmer; SEPARATOR =' | ') AS ?programmer)
    (GROUP_CONCAT(DISTINCT ?programmerName; SEPARATOR =' | ') AS ?programmerName) 
    (GROUP_CONCAT(DISTINCT ?typeName; SEPARATOR=' | ') AS ?typeName)
    WHERE {
    
    VALUES ?input { <http://dbpedia.org/resource/${game}> }
     ?input rdfs:label ?name; onto:releaseDate ?date.
    
    
    #Directeur
    OPTIONAL{
    ?input dbpedia2:director ?director.
       OPTIONAL{
       ?director rdfs:label ?directorName.
       FILTER(lang(?directorName)='en')  
       }
    FILTER(xsd:string(?director))
    }
    
    #Description
    OPTIONAL{
    ?input onto:abstract ?description.
    FILTER(lang(?description)='fr')
    }
    
    
    #Console
    OPTIONAL{
    ?input onto:computingPlatform ?platform.
    ?platform rdfs:label ?console.
    FILTER(lang(?console)='fr' || lang(?console)='en')
    }
    
    #Type
    OPTIONAL{
    ?input onto:genre ?genre.
    ?genre rdfs:label ?typeName.
    FILTER(lang(?typeName)='en')
    }
    
    #Producer
    OPTIONAL{
    ?input  dbpedia2:producer ?producer.
        OPTIONAL{
        ?producer rdfs:label ?producerName.
         FILTER(lang(?producerName)='en')
         }
    FILTER(xsd:string(?producer))
    }
    
    #Designer
    OPTIONAL{
    ?input dbpedia2:designer ?designer.
    ?designer rdfs:label ?designerName.
    FILTER(lang(?designerName)='en')
    }
    
    OPTIONAL{
    ?input dbpedia2:designer ?designer2.
    FILTER(lang(?designer2)='en')
    }
    
    
    #Modes de jeu
    OPTIONAL{
    ?input dbpedia2:modes ?modes.
    ?modes rdfs:label ?modesName.
    FILTER(lang(?modesName)='en')
    
    }
    
    #Developper
    OPTIONAL{
    ?input onto:developer ?developer.
       OPTIONAL{
       ?developer rdfs:label ?developerName.
       FILTER(lang(?developerName)='en')
       }
    }
    
    
    #Programmeur
    OPTIONAL{
    ?input dbpedia2:programmer ?programmer.
       OPTIONAL{
       ?programmer rdfs:label ?programmerName.
       FILTER(lang(?programmerName)='en')
       }
    FILTER(xsd:string(?programmer))
    
    }
    
    FILTER(lang(?name)='fr') 
    }
    GROUP BY ?name ?description ?date `
    
}

function requete(){
    console.log("Recherche en cours");
    var xmlhttp = null;

    if (xmlhttp) {
        console.log("ANNULATION D'UNE REQUETE PAS FINIE");
        xmlhttp.abort();
    }
    var ressources= [];

    var url = "http://dbpedia.org/sparql?query=" + encodeURIComponent(requestAllGames()) + "&format=json";

    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);

        result.results.bindings.forEach(r => {
            ressources.push(r["gameName"].value);
            
        });
        displayGames(ressources);
        xmlhttp = null; 
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function displayALLGames(data){
    var liste = document.getElementById("list");
    liste.innerHTML += `<ul>`
    data.forEach((v => {
        liste.innerHTML += `<li><a href="jeu.html?name=${v}">${v}</li>`

    }) )
}

function displayResultGame(data){
    let name = document.getElementById("name");
    let releaseDate = document.getElementById("releaseDate");
    let description = document.getElementById("description");
    let modes = document.getElementById("modes");
    let consoles = document.getElementById("consoles");
}

function requete_bis(){
    console.log("Recherche en cours");
    var xmlhttp = null;

    if (xmlhttp) {
        console.log("ANNULATION D'UNE REQUETE PAS FINIE");
        xmlhttp.abort();
    }

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

    function getNameParameter(){
        var str = window.location.href;
        var url = new URL(str);
        var name = url.searchParams.get("name");
        return name;
    }
    var game = getNameParameter();
    game = game.replaceAll(" ", "_");
    

    var url = "http://dbpedia.org/sparql?query="   + encodeURIComponent(prefixes+requestInfosByGame(game)) + "&format=json";
    console.log(url);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.responseText);
        console.log(result);
        xmlhttp = null; 
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
}
