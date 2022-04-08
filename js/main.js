let drink = {
    name: document.querySelector("section > h2"),
    photo: document.querySelector("img"),
    instructions: document.querySelector("ul + h3 + p"),
    ingredients: document.querySelector("ul")
};

document.querySelector("#search-name + button").addEventListener("click", findDrink);
document.querySelector("input#search-name").addEventListener("change", findDrink);
document.querySelector("#search-ingredient + button").addEventListener("click", findIngredient);
document.querySelector("input#search-ingredient").addEventListener("change", findIngredient);


function findDrink() {
    let findUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
    let searchTerm = document.querySelector("input#search-name").value;
    searchTerm.replace(" ", "%20");

    fetch(findUrl + searchTerm)
        .then(res => res.json())
        .then(data => {
            console.log(data);  
            let i = 0;

            if (data.drinks == null) {
                drink.name.textContent = "No drink found"
                drink.instructions.textContent = `No drink found for '${searchTerm.replace("%20", " ")},' try searching for something else.`;
                drink.photo.src = "";
            }
            
            clearIngredients();
            drink.photo.src = data.drinks[i].strDrinkThumb;
            drink.name.textContent = data.drinks[i].strDrink;
            drink.instructions.textContent = data.drinks[i].strInstructions;

            let ingredientCount = 1;
            while (data.drinks[i]["strIngredient" + ingredientCount] !== null) {
                let li = document.createElement("li");
                if (data.drinks[i]["strMeasure" + ingredientCount] == null) {
                    li.textContent = data.drinks[i]["strIngredient" + ingredientCount];
                } else li.textContent = data.drinks[i]["strMeasure" + ingredientCount] + " " + data.drinks[i]["strIngredient" + ingredientCount];
                drink.ingredients.appendChild(li);
                ingredientCount++;
            }
        })
        .catch(err => { 
            console.log(`error ${err}`);
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
            console.log(drinkID);
            })
        .catch(err => {
            console.log(`error ${err}`);
            clearDrink();
            drink.instructions.textContent = "No drinks found, please try another ingredient."
    });

    fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11052")
    // fetch(idURL + drinkID)
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(`error ${err}`);
        })

}


function clearDrink() {
    clearIngredients();
    drink.name.textContent = "";
    drink.photo.src = "";
    drink.instructions.textContent = "";
}

function clearIngredients() {
    const liArr = document.querySelectorAll("li");
    for (let node of liArr) {
        drink.ingredients.removeChild(node);
    }
}

