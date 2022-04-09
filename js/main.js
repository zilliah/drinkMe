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
            
            updateDrink(data, 0);
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
            fetch(idURL + drinkID)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    updateDrink(data, j);
                })
                .catch(err => {
                    console.log(`error ${err}`);
                })
            })
        .catch(err => {
            console.log(`error ${err}`);
            clearDrink();
            drink.instructions.textContent = "No drinks found, please try another ingredient."
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
