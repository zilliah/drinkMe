let drink = {
    name: document.querySelector("section > div > h2"),
    photo: document.querySelector("img"),
    instructions: document.querySelector("p"),
    ingredients: document.querySelector("ul")
};

document.querySelector("#search-name + button").addEventListener("click", findDrink);
document.querySelector("input#search-name").addEventListener("change", findDrink);
document.querySelector("#search-ingredient + button").addEventListener("click", findIngredient);
document.querySelector("input#search-ingredient").addEventListener("change", findIngredient);
document.querySelector("#random").addEventListener("click", findRandom);
const anotherDrink = document.querySelector("section.next");

function findDrink() {
    let findUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
    let searchTerm = document.querySelector("input#search-name").value;
    if (searchTerm === "" | searchTerm === /\s+/) noMatch(searchTerm);
    searchTerm.replace(" ", "%20");
    
    
    fetch(findUrl + searchTerm)
    .then(res => res.json())
    .then(data => {
        console.log(data);  
        let i = 0;
        if (data.drinks == null) noMatch(searchTerm);
        updateDrink(data, i);
        document.querySelector("#another").addEventListener("click", nextDrink(data, i));
        anotherDrink.classList.remove("next");
    })
    .catch(err => { 
        console.log(`error ${err}`);
        noMatch(searchTerm);
    });
    
}

function findIngredient() {
    let ingrURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
    let idURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
    let searchTerm = document.querySelector("input#search-ingredient").value;
    searchTerm.replace(" ", "%20");
    let drinkID = "";
    
    fetch(ingrURL + searchTerm)
        .then(res => res.json()) 
        .then(data => {
            console.log(data);  
            let j = 0;
            drinkID = data.drinks[j].idDrink;
            
            fetch(idURL + drinkID)
            .then(res => res.json())
            .then(datum => {
                updateDrink(datum, j);
                anotherDrink.classList.remove("next");
            })
            .catch(err => {
                console.log(`error ${err}`);
                noMatch();
            })

            document.querySelector("#another").addEventListener("click", function() {
                j++;
                drinkID = data.drinks[j].idDrink;
                
                fetch(idURL + drinkID)
                .then(res => res.json())
                .then(datum => {
                    console.log(datum);
                    updateDrink(datum, 0);
                    anotherDrink.classList.remove("next");

                    })
                    .catch(err => {
                        console.log(`error ${err}`);
                        noMatch();
                })
            });
        })
        .catch(err => {
            console.log(`error ${err}`);
            noMatch(searchTerm);
    });
}

function findRandom() {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then(res => res.json())
        .then(data => {
            console.log(data);  
            updateDrink(data, 0);
        })
        .catch(err => { 
            console.log(`error ${err}`);
            noMatch(null);
        });

}


function clearDrink() {
    const liArr = document.querySelectorAll("li");
    for (let node of liArr) {
        drink.ingredients.removeChild(node);
    }
    drink.name.textContent = "";
    drink.photo.src = "";
    drink.instructions.textContent = "";
    anotherDrink.classList.add("next");
}

function updateDrink(data, index) {
    clearDrink();
    drink.photo.src =  data.drinks[index].strDrinkThumb;
    drink.name.textContent = data.drinks[index].strDrink;
    drink.instructions.textContent = data.drinks[index].strInstructions;

    let ingredientCount = 1;
    while (data.drinks[index]["strIngredient" + ingredientCount] !== null) {
        let li = document.createElement("li");
        if (data.drinks[index]["strMeasure" + ingredientCount] == null) {
            li.textContent = data.drinks[index]["strIngredient" + ingredientCount];
        } else li.textContent = data.drinks[index]["strMeasure" + ingredientCount] + " " + data.drinks[index]["strIngredient" + ingredientCount];
        drink.ingredients.appendChild(li);
        ingredientCount++;
    }

}

function noMatch(search) {
    clearDrink();
    drink.name.textContent = "No drink found";
    anotherDrink.classList.add("next");
    if (search === null) drink.instructions.textContent = "Unknown error - please try again.";
    else drink.instructions.textContent = `No drinks found for "${search}" please try another search.`;
}

function nextDrink(data, index) {
    return function() {
        if (index < data.drinks.length - 1) index++;
        else index = 0;
        updateDrink(data, index);
        anotherDrink.classList.remove("next");

    }
}