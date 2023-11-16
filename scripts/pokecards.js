function addLoadingCards() {
    let container = document.getElementById("container-pokecards");

    let numberResults = document.getElementById("results-number");

    numberResults.innerHTML = "";
    numberResults.innerHTML = `
        <div class="card no-shadow">
          <div class="card-body">
            <h2 class="card-title skeleton"></h2>
          </div>
        </div>
      `;

    let loadingCard = `
      <div class="pokecard card">
        <div class="image card-img skeleton"></div>
        <div class="content-pokecard card-body">
          <h2 class="card-title skeleton"></h2>
          <p class="pokecard-id card-intro skeleton"></p>
          <div class="pokecard-types-container"></div>
        </div>
      </div>
    `;

    container.innerHTML = "";

    const LOADING_CARDS_COUNT = 14; // Arbitrary value

  
    for (let i = 0; i < 14; i++) {
      container.innerHTML += loadingCard;
    }

}

function loadingCards() {
    document.getElementById("loader").style.display = "block";
    addLoadingCards();
}

function addPokeCard(id, name, types) {

    var firstTwoTypes = types.slice(0, 2);
  
    // Créée l'élément div
    var pokeCardClickable = document.createElement("a");
    pokeCardClickable.href = `profil.html?id=${parseInt(id, 10)}`;

    var pokeCardDiv = document.createElement("div");
    pokeCardDiv.classList.add("pokecard");

    // Créer la partie image de la pokecard
    var imageDiv = document.createElement("div");
    imageDiv.classList.add("image");
    var img = document.createElement("img");
    img.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
      parseInt(id, 10).toString() +
      ".png";
    img.alt = "";
    imageDiv.appendChild(img);

    // Créer la partie contenu de la pokecard
    var contentDiv = document.createElement("div");
    contentDiv.classList.add("content-pokecard");

    var h2 = document.createElement("h2");
    h2.textContent = name;

    var pId = document.createElement("p");
    pId.classList.add("pokecard-id");
    pId.textContent = "n°" + id;

    var typesContainerDiv = document.createElement("div");
    typesContainerDiv.classList.add("pokecard-types-container");

    // Ajouter les types à la pokecard
    firstTwoTypes.forEach(function(type) {
      var typeImg = document.createElement("img");
      typeImg.src = "img/types/" + type + ".png"; 
      typesContainerDiv.appendChild(typeImg);
    });

    // Assembler les parties de la pokecard
    contentDiv.appendChild(h2);
    contentDiv.appendChild(pId);
    contentDiv.appendChild(typesContainerDiv);

    pokeCardDiv.appendChild(imageDiv);
    pokeCardDiv.appendChild(contentDiv);

    var hasMoreThanTwoTypes = types.length > 2;
    if (hasMoreThanTwoTypes) {
      var threeDots = document.createElement("p");
      threeDots.classList.add("pokecard-hasMoreThanTwoTypes");
      threeDots.textContent = "...";
      pokeCardDiv.appendChild(threeDots);
    }

    pokeCardClickable.appendChild(pokeCardDiv);

    // Ajouter la pokecard au conteneur
    var container = document.querySelector(".container-pokecards");
    container.appendChild(pokeCardClickable);
}
