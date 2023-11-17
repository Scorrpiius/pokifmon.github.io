function requestAllGames(){
  return `SELECT DISTINCT ?gameNameENG ?gameNameFR WHERE {
      {<http://dbpedia.org/resource/Category:Pokémon_video_games> ?property ?hasValue }
      UNION
      {?isValueOf ?property <http://dbpedia.org/resource/Category:Pokémon_video_games>; rdfs:label ?gameNameENG; rdfs:label ?gameNameFR}

      FILTER(lang(?gameNameENG)='en')
      FILTER(lang(?gameNameFR)='fr')
      }
      OFFSET 5
      LIMIT 31`

}

function requestInfosByGame(game){
  return `SELECT ?name  ?description ?date 
  (GROUP_CONCAT(DISTINCT ?director; SEPARATOR=', ') AS ?director)
  (GROUP_CONCAT(DISTINCT ?directorName ; SEPARATOR=', ') AS ?directorName)
  (GROUP_CONCAT(DISTINCT ?modesName; SEPARATOR =', ') AS ?modesName)
  (GROUP_CONCAT(DISTINCT ?designerName ; SEPARATOR =', ') AS ?designerName)
  (GROUP_CONCAT(DISTINCT ?designer; SEPARATOR =', ') AS ?designer)
  (GROUP_CONCAT(DISTINCT ?console; SEPARATOR =', ') AS ?console)  
  (GROUP_CONCAT(DISTINCT ?producer; SEPARATOR =', ') AS ?producer)
  (GROUP_CONCAT(DISTINCT ?producerName; SEPARATOR =', ') AS ?producerName)
  (GROUP_CONCAT(DISTINCT ?developerName; SEPARATOR =', ') AS ?developerName) 
  (GROUP_CONCAT(DISTINCT ?programmer; SEPARATOR =', ') AS ?programmer)
  (GROUP_CONCAT(DISTINCT ?programmerName; SEPARATOR =', ') AS ?programmerName) 
  (GROUP_CONCAT(DISTINCT ?typeName; SEPARATOR=', ') AS ?typeName)
  WHERE 
  {

    VALUES ?input { <http://dbpedia.org/resource/${game}> }
    ?input rdfs:label ?name; onto:releaseDate ?date.


    #Directeur
    OPTIONAL{
      ?input dbpedia2:director ?director.
      OPTIONAL{
        ?director rdfs:label ?directorName.
        FILTER(lang(?directorName)='en')  
      }
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
      FILTER(lang(?console)='fr')
    }

    #Type
    OPTIONAL{
      ?input onto:genre ?genre.
      ?genre rdfs:label ?typeName.
      FILTER(lang(?typeName)='en')
    }

    #Producer
    OPTIONAL{
      ?input dbpedia2:producer ?producer.
      OPTIONAL{
        ?producer rdfs:label ?producerName.
        FILTER(lang(?producerName)='en')
      }
      FILTER(xsd:string(?producer))
    }

    #Designer
    OPTIONAL{
      ?input dbpedia2:designer ?designer.
      OPTIONAL{
        ?designer rdfs:label ?designerName.
        FILTER(lang(?designerName)='en')
      }
      FILTER(lang(?designer)='en')
      OPTIONAL{
        FILTER(xsd:string(?designer))
      }
    }

    #Modes de jeu
    OPTIONAL{
      ?input dbpedia2:modes ?modes.
      ?modes rdfs:label ?modesName.
      FILTER(lang(?modesName)='fr')
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

  } GROUP BY ?name ?description ?date `

}



function requestPokemonByGeneration(generation) {
  return `SELECT DISTINCT ?pokemonLabel ?pokedexNumber (GROUP_CONCAT(DISTINCT ?typeName; SEPARATOR=';') AS ?types)
  WHERE {
                ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
                ?pokemon rdfs:label ?pokemonLabel.
                ?pokemon p:P1685 ?statement.
                ?statement ps:P1685 ?pokedexNumber; 
                           pq:P972 wd:Q20005020. # catalogue est le "pokedex national"
                ?pokemon wdt:P31 ?type.
                ?type rdfs:label ?typeName.
                ?pokemon p:P361 ?partOf.
                ?partOf ps:P361 ?generations.
                ?generations rdfs:label ?generationName.

                 FILTER(str(?generationName)= "list of Pokémon introduced in ${generation}")
                 FILTER (lang(?pokemonLabel)='fr')
                  FILTER (lang(?typeName)='fr')
    }
          GROUP BY ?pokemonLabel ?pokedexNumber 
         ORDER BY ?pokedexNumber


  `
}

function requestAllGenerations() {
  return `SELECT ?generation ?ordre
          WHERE
          {
            wd:Q117037996 p:P527 ?o.
            ?o ps:P527 ?statement.
            ?o pq:P1545 ?ordre.
            ?statement rdfs:label ?generation
            FILTER(lang(?generation)='fr')
          }
          ORDER BY ?ordre`
}

function requestPokemonList() {
  return `SELECT DISTINCT ?pokemon ?pokemonLabel ?pokedexNumber (GROUP_CONCAT(DISTINCT ?typeName; SEPARATOR=';') AS ?types)
        WHERE 
        {
              ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
              ?pokemon rdfs:label ?pokemonLabel.
              ?pokemon p:P1685 ?statement.
              ?statement ps:P1685 ?pokedexNumber;
                        pq:P972 wd:Q20005020. # catalogue est le "pokedex national"
              ?pokemon wdt:P31 ?type.
              ?type rdfs:label ?typeName.
              FILTER (! wikibase:isSomeValue(?pokedexNumber) )
              FILTER (lang(?typeName)='fr')
              FILTER (lang(?pokemonLabel)='fr')
        }
        GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber 
        ORDER BY (xsd:integer(?pokedexNumber))`
}

function requestPokemonListNames() {
  return `SELECT DISTINCT ?pokemonLabel
        WHERE 
        {
            ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
            ?pokemon rdfs:label ?pokemonLabel.
            FILTER (lang(?pokemonLabel)='fr')
        } ORDER BY ?pokemonLabel`
}


function requestPokemonByName(nom) {
  return `SELECT DISTINCT  ?pokemonLabel ?pokedexNumber (GROUP_CONCAT(DISTINCT ?typeName; SEPARATOR=';') AS ?types)
          WHERE
          {
            ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
            ?pokemon rdfs:label ?pokemonLabel.
            ?pokemon p:P1685 ?statement.
            ?statement ps:P1685 ?pokedexNumber;
                      pq:P972 wd:Q20005020. # catalogue est le "pokedex national"
            ?pokemon wdt:P31 ?type.
            ?type rdfs:label ?typeName.
            FILTER (! wikibase:isSomeValue(?pokedexNumber) )
            FILTER (lang(?typeName)='fr')
            FILTER (contains(lcase(?pokemonLabel), "${nom.toLowerCase()}"))
            FILTER(lang(?pokemonLabel) = 'fr')

          }
          GROUP BY  ?pokemonLabel ?pokedexNumber 
          ORDER BY (xsd:integer(?pokedexNumber))`
}



function requestPokemonByType(type) {
  return `SELECT DISTINCT ?pokemon ?pokemonLabel ?pokedexNumber (GROUP_CONCAT(DISTINCT ?typeName; SEPARATOR=';') AS ?types)
            WHERE
            {
                ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
                ?pokemon rdfs:label ?pokemonLabel.
                ?pokemon p:P1685 ?statement.
                ?statement ps:P1685 ?pokedexNumber;
                          pq:P972 wd:Q20005020.
                ?pokemon wdt:P31 ?type, ?typeFilter.

                ?type rdfs:label ?typeName.
                ?typeFilter rdfs:label ?typeNameFilter.
                FILTER (! wikibase:isSomeValue(?pokedexNumber) )
                FILTER (contains(lcase(strafter(?typeNameFilter,"Pokémon de type")), "${type.toLowerCase()}"))
                FILTER(lang(?typeName)= 'fr')
                FILTER(lang(?pokemonLabel)= 'fr')
            }
            GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber
            ORDER BY (xsd:integer(?pokedexNumber))`
}





function requestPokemonByPokedexID(id) {
  return `SELECT DISTINCT ?pokemon ?pokemonLabel ?pokedexNumber (GROUP_CONCAT(DISTINCT ?typeName; SEPARATOR=';') AS ?types)
  WHERE
  {
      ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
      ?pokemon rdfs:label ?pokemonLabel.
      ?pokemon p:P1685 ?statement.
      ?statement ps:P1685 ?pokedexNumber;
                pq:P972 wd:Q20005020. # catalogue est le "pokedex national"
      ?pokemon wdt:P31 ?type, ?typeFilter.

      ?type rdfs:label ?typeName.
      ?typeFilter rdfs:label ?typeNameFilter.
      FILTER (! wikibase:isSomeValue(?pokedexNumber) )
      FILTER(lang(?typeName)= 'fr')
      FILTER(lang(?pokemonLabel)= 'fr')
      FILTER(xsd:integer(?pokedexNumber) = ${id})
  }
  GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber
  ORDER BY (xsd:integer(?pokedexNumber))`
}




function requestPokemonProfile(id) {
  return `SELECT DISTINCT  ?pokemonLabel ?pokedexNumber (GROUP_CONCAT(DISTINCT ?typeLabel; SEPARATOR=';') AS ?types) ?taille ?couleurLabel ?masse ?genLabel ?genderLabel (GROUP_CONCAT(DISTINCT ?precedentLabel; SEPARATOR=';') AS ?preLab)
    (GROUP_CONCAT(DISTINCT ?suivantLabel; SEPARATOR=';') AS ?suiLab)  
      WHERE
      {
        #Nom
        ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
        ?pokemon rdfs:label ?pokemonLabel.

        #Pokedex ID
        ?pokemon p:P1685 ?statement.
        ?statement ps:P1685 ?pokedexNumber; 
                   pq:P972 wd:Q20005020. # catalogue est le "pokedex national"

        #Type
        ?pokemon wdt:P31 ?type.
        ?type wdt:P31 wd:Q115980997;  rdfs:label ?typeLabel.

        #Taille
        OPTIONAL{
          ?pokemon wdt:P2048 ?taille.
        }

        #Masse 
        OPTIONAL{
          ?pokemon wdt:P2067 ?masse
        }

        #Couleur
          OPTIONAL {
            ?pokemon wdt:P462 ?couleur.
            ?couleur rdfs:label ?couleurLabel.
            FILTER(lang(?couleurLabel) = 'fr')
          }

        #Apparition
        OPTIONAL{
          ?pokemon wdt:P4584 ?gen.
          ?gen rdfs:label ?genLabel.
          FILTER(lang(?genLabel)='fr')
        }

        #Sexe 
        OPTIONAL {
          ?pokemon wdt:P21 ?gender.
          ?gender rdfs:label ?genderLabel.
          FILTER(lang(?genderLabel)='fr')
        }

        #Evolution précédente
        OPTIONAL{
          ?pokemon p:P361 ?pages.
          ?pages ps:P361 ?evolution.
          ?evolution rdfs:label ?evolutionLabel.
          ?pages pq:P155 ?precedent.
          ?precedent rdfs:label ?precedentLabel.

          FILTER(lang(?precedentLabel)='fr')
          FILTER(lang(?evolutionLabel)='fr')
          FILTER(contains(?evolutionLabel, "évolutions") || contains(?evolutionLabel, ?pokemonLabel))
        }

        #Evolution suivante
        OPTIONAL{
          ?pokemon p:P361 ?pages.
          ?pages ps:P361 ?evolution.
          ?evolution rdfs:label ?evolutionLabel.
          ?pages pq:P156 ?suivant.
          ?suivant rdfs:label ?suivantLabel.

          FILTER(lang(?suivantLabel)='fr')
          FILTER(lang(?evolutionLabel)='fr')
          FILTER(contains(?evolutionLabel, "évolutions") || contains(?evolutionLabel, ?pokemonLabel))
          }

          FILTER (! wikibase:isSomeValue(?pokedexNumber) )
          FILTER(xsd:integer(?pokedexNumber) = ${id})
          FILTER(lang(?pokemonLabel) = 'fr')
          FILTER(lang(?typeLabel) = 'fr')

      }
      GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber ?taille ?couleurLabel ?masse ?genLabel ?genderLabel`;
}


// function requestPokemonProfile(id) {
//   return `SELECT DISTINCT  ?pokemonLabel ?pokedexNumber (GROUP_CONCAT(DISTINCT ?typeLabel; SEPARATOR=';') AS ?types) 
//     ?taille ?couleurLabel ?masse ?genLabel ?genderLabel 
//     (GROUP_CONCAT(DISTINCT ?precedentLabel; SEPARATOR=';') AS ?preLab) 
//     (GROUP_CONCAT(DISTINCT ?suivantLabel; SEPARATOR=';') AS ?suiLab)
//     ?precedentPokedexNumber ?suivantPokedexNumber  
//     WHERE
//     {
//       #Nom
//       ?pokemon wdt:P31/wdt:P279* wd:Q3966183 .
//       ?pokemon rdfs:label ?pokemonLabel.

//       #Pokedex ID
//       ?pokemon p:P1685 ?statement.
//       ?statement ps:P1685 ?pokedexNumber;
//                  pq:P972 wd:Q20005020. # catalogue est le "pokedex national"

//       #Type
//       ?pokemon wdt:P31 ?type.
//       ?type wdt:P31 wd:Q115980997;  rdfs:label ?typeLabel.

//       #Taille
//       OPTIONAL{
//         ?pokemon wdt:P2048 ?taille.
//       }

//       #Masse 
//       OPTIONAL{
//         ?pokemon wdt:P2067 ?masse
//       }

//       #Couleur
//       OPTIONAL {
//         ?pokemon wdt:P462 ?couleur.
//         ?couleur rdfs:label ?couleurLabel.
//         FILTER(lang(?couleurLabel) = 'fr')
//       }

//       #Apparition
//       OPTIONAL{
//         ?pokemon wdt:P4584 ?gen.
//         ?gen rdfs:label ?genLabel.
//         FILTER(lang(?genLabel)='fr')
//       }

//       #Sexe 
//       OPTIONAL {
//         ?pokemon wdt:P21 ?gender.
//         ?gender rdfs:label ?genderLabel.
//         FILTER(lang(?genderLabel)='fr')
//       }

//       #Evolution précédente
//       OPTIONAL{
//         ?pokemon p:P361 ?evolutionStatement.
//         ?evolutionStatement ps:P361 ?evolution.
//         ?evolution rdfs:label ?evolutionLabel.
//         ?evolutionStatement pq:P155 ?precedent.
//         ?precedent rdfs:label ?precedentLabel.
//         OPTIONAL { ?precedent p:P1685 ?precedentStatement. 
//                    ?precedentStatement ps:P1685 ?precedentPokedexNumber. }
//         FILTER(lang(?precedentLabel)='fr')
//       }

//       #Evolution suivante
//       OPTIONAL{
//         ?pokemon p:P361 ?evolutionStatement.
//         ?evolutionStatement ps:P361 ?evolution.
//         ?evolution rdfs:label ?evolutionLabel.
//         ?evolutionStatement pq:P156 ?suivant.
//         ?suivant rdfs:label ?suivantLabel.
//         OPTIONAL { ?suivant p:P1685 ?suivantStatement. 
//                    ?suivantStatement ps:P1685 ?suivantPokedexNumber. }
//         FILTER(lang(?suivantLabel)='fr')
//       }

//       FILTER (! wikibase:isSomeValue(?pokedexNumber) )
//       FILTER(xsd:integer(?pokedexNumber) = ${id})
//       FILTER(lang(?pokemonLabel) = 'fr')
//       FILTER(lang(?typeLabel) = 'fr')
//     }
//     GROUP BY ?pokemon ?pokemonLabel ?pokedexNumber ?taille ?couleurLabel ?masse ?genLabel ?genderLabel 
//     ?precedentPokedexNumber ?suivantPokedexNumber`;
// }



function requete_get_id_type(nom_type) {
  const typeToId = {
    "normal": 0,
    "feu": 1,
    "eau": 2,
    "plante": 3,
    "électrik": 4,
    "glace": 5,
    "combat": 6,
    "poison": 7,
    "sol": 8,
    "vol": 9,
    "psy": 10,
    "insecte": 11,
    "roche": 12,
    "spectre": 13,
    "dragon": 14,
    "ténèbres": 15,
    "acier": 16,
    "fée": 17
  };

  return typeToId.hasOwnProperty(nom_type) ? typeToId[nom_type] : -1;
}

function requete_get_nom_id(id) {
  const idToType = {
    0: "normal",
    1: "feu",
    2: "eau",
    3: "plante",
    4: "électrik",
    5: "glace",
    6: "combat",
    7: "poison",
    8: "sol",
    9: "vol",
    10: "psy",
    11: "insecte",
    12: "roche",
    13: "spectre",
    14: "dragon",
    15: "ténèbres",
    16: "acier",
    17: "fée"
  };
  return idToType.hasOwnProperty(id) ? idToType[id] : -1;
}

function creationMatriceType() {
  //type(s) du Pokémon qui nous intéresse

  //matrix_types : la matrice des faiblesses et des forces et des faiblesses
  //lorsque la case est à 1 alors les types sont neutres l'un envers l'autre
  //lorsque la case est entre 0 et 1 alors le type est faible contre l'autre type (1/2 des dégâts pour les attaques)
  //lorsque la case est au dessus de 1 alors le type est fort contre l'autre type (attaques 2 fois plus efficaces)
  //lorsque la case est à 0 alors le type est innéficace contre l'autre type (aucune des attaques ne fonctionnera)
  let matrix_types = [];
  for (let i = 0; i < 18; i++) {
    matrix_types.push(Array(18).fill(1));
  }

  //Normal
  matrix_types[0][12] = 0.5;
  matrix_types[0][13] = 0;
  matrix_types[0][16] = 0.5;

  //Feu
  matrix_types[1][1] = 0.5;
  matrix_types[1][2] = 0.5;
  matrix_types[1][3] = 2;
  matrix_types[1][5] = 2;
  matrix_types[1][11] = 2;
  matrix_types[1][12] = 0.5;
  matrix_types[1][14] = 0.5;
  matrix_types[1][16] = 2;


  //Eau
  matrix_types[2][1] = 2;
  matrix_types[2][2] = 0.5;
  matrix_types[2][3] = 0.5;
  matrix_types[2][8] = 2;
  matrix_types[2][12] = 2;
  matrix_types[2][14] = 0.5;

  //Plante
  matrix_types[3][1] = 0.5;
  matrix_types[3][2] = 2;
  matrix_types[3][3] = 0.5;
  matrix_types[3][7] = 0.5;
  matrix_types[3][8] = 2;
  matrix_types[3][9] = 0.5;
  matrix_types[3][11] = 0.5;
  matrix_types[3][12] = 2;
  matrix_types[3][14] = 0.5;
  matrix_types[3][16] = 0.5;

  //Electrik
  matrix_types[4][2] = 2;
  matrix_types[4][3] = 0.5;
  matrix_types[4][4] = 0.5;
  matrix_types[4][8] = 0;
  matrix_types[4][9] = 2;
  matrix_types[4][14] = 0.5;

  //Glace
  matrix_types[5][1] = 0.5;
  matrix_types[5][2] = 0.5;
  matrix_types[5][3] = 2;
  matrix_types[5][5] = 0.5;
  matrix_types[5][8] = 2;
  matrix_types[5][9] = 2;
  matrix_types[5][14] = 2;
  matrix_types[5][16] = 0.5;

  //Combat
  matrix_types[6][0] = 2;
  matrix_types[6][5] = 2;
  matrix_types[6][7] = 0.5;
  matrix_types[6][9] = 0.5;
  matrix_types[6][10] = 0.5;
  matrix_types[6][11] = 0.5;
  matrix_types[6][12] = 2;
  matrix_types[6][13] = 0;
  matrix_types[6][15] = 2;
  matrix_types[6][16] = 2;
  matrix_types[6][17] = 0.5;

  //Poison
  matrix_types[7][3] = 2;
  matrix_types[7][7] = 0.5;
  matrix_types[7][8] = 0.5;
  matrix_types[7][12] = 0.5;
  matrix_types[7][13] = 0.5;
  matrix_types[7][16] = 0;
  matrix_types[7][17] = 2;

  //Sol
  matrix_types[8][1] = 2;
  matrix_types[8][3] = 0.5;
  matrix_types[8][4] = 2;
  matrix_types[8][7] = 2;
  matrix_types[8][9] = 0;
  matrix_types[8][11] = 0.5;
  matrix_types[8][12] = 2;
  matrix_types[8][16] = 2;

  //Vol
  matrix_types[9][3] = 2;
  matrix_types[9][4] = 0.5;
  matrix_types[9][6] = 2;
  matrix_types[9][11] = 2;
  matrix_types[9][12] = 0.5;
  matrix_types[9][16] = 0.5;

  //Psy
  matrix_types[10][6] = 2;
  matrix_types[10][7] = 2;
  matrix_types[10][10] = 0.5;
  matrix_types[10][15] = 0;
  matrix_types[10][16] = 0.5;

  //Insecte
  matrix_types[11][1] = 0.5;
  matrix_types[11][3] = 2;
  matrix_types[11][6] = 0.5;
  matrix_types[11][7] = 0.5;
  matrix_types[11][9] = 0.5;
  matrix_types[11][10] = 2;
  matrix_types[11][13] = 0.5;
  matrix_types[11][15] = 2;
  matrix_types[11][16] = 0.5;
  matrix_types[11][17] = 0.5;

  //Roche
  matrix_types[12][1] = 2;
  matrix_types[12][5] = 2;
  matrix_types[12][6] = 0.5;
  matrix_types[12][8] = 0.5;
  matrix_types[12][9] = 2;
  matrix_types[12][11] = 2;
  matrix_types[12][16] = 0.5;

  //Spectre
  matrix_types[13][0] = 0;
  matrix_types[13][10] = 2;
  matrix_types[13][13] = 2;
  matrix_types[13][15] = 0.5;

  //Dragon
  matrix_types[14][14] = 2;
  matrix_types[14][16] = 0.5;
  matrix_types[14][17] = 0;

  //Ténèbres
  matrix_types[15][6] = 0.5;
  matrix_types[15][10] = 2;
  matrix_types[15][13] = 2;
  matrix_types[15][15] = 0.5;
  matrix_types[15][17] = 0.5;

  //Acier
  matrix_types[16][1] = 0.5;
  matrix_types[16][2] = 0.5;
  matrix_types[16][4] = 0.5;
  matrix_types[16][5] = 2;
  matrix_types[16][12] = 2;
  matrix_types[16][16] = 0.5;
  matrix_types[16][17] = 2;

  //Fee
  matrix_types[17][1] = 0.5;
  matrix_types[17][6] = 2;
  matrix_types[17][7] = 0.5;
  matrix_types[17][14] = 2;
  matrix_types[17][15] = 2;
  matrix_types[17][16] = 0.5;

  return matrix_types;
}


function requete_faiblesses(matrix_types, type){

    //array_type : type(s) du Pokémon qui nous intéresse en id plutôt qu'en texte
    let array_type = [];
    // Parcours du tableau avec une boucle for
    for (let i = 0; i < type.length; i++) {
      array_type[i] = requete_get_id_type(type[i]);
    }

    //faiblesses : tableau des noms des types contre lequel le Pokémon est faible
    let faiblesses = [];

    //calcul des faiblesses 
    let result_profil_type = [];
    for (let i = 0; i < 18; i++) {
      result_profil_type[i] = 1;
      for (let j = 0; j < array_type.length; j++) {
        result_profil_type[i] = result_profil_type[i] * matrix_types[i][array_type[j]];
      }
      if(result_profil_type[i]>1){
        faiblesses.push(requete_get_nom_id(i));
      }
    }


  console.log(faiblesses);

  return faiblesses;
}

function requete_forces(matrix_types, type){

  //array_type : type(s) du Pokémon qui nous intéresse en id plutôt qu'en texte
  let array_type = [];
  // Parcours du tableau avec une boucle for
  for (let i = 0; i < type.length; i++) {
    array_type[i] = requete_get_id_type(type[i]);
  }

  //forces : tableau des noms des types contre lequel le Pokémon est faible
  let forces = [];

  //calcul des forces 
  let result_profil_type = [];
  for (let i = 0; i < 18; i++) {
    result_profil_type[i] = 1;
    for (let j = 0; j < array_type.length; j++) {
      result_profil_type[i] = result_profil_type[i] * matrix_types[array_type[j]][i];
    }
    if(result_profil_type[i]>1){
      forces.push(requete_get_nom_id(i));
    }
  }


  console.log(forces);

  return forces;
}



