//The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM

let url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const photo = document.querySelector("img");
const drinkName = document.querySelector("button + h2");
const instructions = document.querySelector("h3");

document.querySelector("button").addEventListener("click", getDrink);
document.querySelector("input").addEventListener("change", getDrink);

function getDrink() {
    let searchTerm = document.querySelector("input").value;

    fetch(url + searchTerm)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log(data.drinks);  
            photo.src = data.drinks[0].strDrinkThumb;
            drinkName.textContent = data.drinks[0].strDrink;
            instructions.textContent = data.drinks[0].strInstructions;
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

