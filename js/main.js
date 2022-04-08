let drink = {
    name: document.querySelector("section > h2"),
    photo: document.querySelector("img"),
    instructions: document.querySelector("ul + h3 + p"),
    ingredients: document.querySelector("ul")
};

let findUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
// let ingrULR = "www.thecocktaildb.com/api/json/v1/1/filter.php?i=";

document.querySelector("#search-name + button").addEventListener("click", findDrink);
document.querySelector("input#search-name").addEventListener("change", findDrink);

// document.querySelector("#search-ingredient + button").addEventListener("click", findIngredient);
// document.querySelector("input#search-ingredient").addEventListener("change", findIngredient);


function findDrink() {
    let searchTerm = document.querySelector("input#search-name").value;
    searchTerm.replace(" ", "%20");

    fetch(findUrl + searchTerm)
        .then(res => res.json())
        .then(data => {
            console.log(data);  

            if (data.drinks == null) {
                drink.name.textContent = "No drink found"
                drink.instructions.textContent = `No drink found for '${searchTerm.replace("%20", " ")},' try searching for something else.`;
                drink.photo.src = "";
            }

            drink.photo.src = data.drinks[0].strDrinkThumb;
            drink.name.textContent = data.drinks[0].strDrink;
            drink.instructions.textContent = data.drinks[0].strInstructions;

            let ingredientCount = 1;
            while (data.drinks[0]["strIngredient" + ingredientCount] !== null) {
                
                console.log(data.drinks[0]["strIngredient" + ingredientCount]);

                let li = document.createElement("li");

                if (data.drinks[0]["strMeasure" + ingredientCount] == null) {
                    li.textContent = data.drinks[0]["strIngredient" + ingredientCount];
                } else li.textContent = data.drinks[0]["strMeasure" + ingredientCount] + " " + data.drinks[0]["strIngredient" + ingredientCount];
                drink.ingredients.appendChild(li);
                ingredientCount++;
            }
        })
        .catch(err => { 
            console.log(`error ${err}`);
        });
}


// function findIngredient() {
//     let searchTerm = document.querySelector("input#search-ingredient").value;
//     searchTerm.replace(" ", "%20");


//     fetch(ingrULR + searchTerm)
//         .then(res => res.json()) // parse response as JSON
//         .then(data => {
//             console.log(data);  

//             if (data.drinks == null) {
//                 drink.name.textContent = "No drink found"
//                 drink.instructions.textContent = "No drink found for that search, try searching for something else.";
//                 drink.photo.src = "";
//                 drink.ingredients.replaceChildren();
//             }

//             drink.photo.src = data.drinks[0].strDrinkThumb;
//             drink.name.textContent = data.drinks[0].strDrink;
//             drink.instructions.textContent = data.drinks[0].strInstructions;
//         })
//         .catch(err => {
//             console.log(`error ${err}`);
//         });
// }

// "www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin"