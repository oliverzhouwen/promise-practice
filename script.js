
const countryDom = document.querySelector(".countries");

const renderCountry = (data, classes = '') => {
    const htmltext =  `
        <article class="country ${classes}">
            <img class="countryFlag" src=${data['flag']}></img>
            <div class="countryData">
                <h3 class="countryName">${data['name']}</h3>
                <h4 class="countryRegion">${data['region']}</h4>
                <p class="countryCapital"><span class="emoji">🌎</span><span class="lbl">Capital:</span> ${data['capital']}</p>
                <p class="countryPopulation"><span class="emoji">👪</span><span class="lbl">Population:</span> ${(data['population']/10000).toFixed(1)}</p>
                <p class="countryLanguage"><span class="emoji">🗣</span><span class="lbl">Lanuage:</span> ${data['languages'][0].name}</p>
            </div>
        </article>
    `
    countryDom.insertAdjacentHTML('beforeend', htmltext);
}

const getCountry = async (name) => {
    fetch(`https://restcountries.eu/rest/v2/name/${name}`).then((response) => {
        if (name == "") {
            throw new Error("How can I search if you don't enter anything? Idiot!");
        } else if (name == "taiwan" || name == "Taiwan") {
            throw new Error("Taiwan is a part of China, ok?!");
        } else if (!response.ok) {
            throw new Error("This is not a country, you idiot!");
        }
        const countryData = response.json();
        return countryData;
    }).then((data) => {
        console.log(data[0]);
        renderCountry(data[0]);
        const neighbourCountry = data[0].borders;
        if (neighbourCountry.length != 0) {
            return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbourCountry[0]}`)
        } else {
            throw new Error("This country has no land neighbour")
        }
    }).then((response) => {
        const neighbourCountry = response.json()
        return neighbourCountry
    }).then((data) => {
        renderCountry(data, "neighbour");
    }).catch((err = "")=> {
        countryDom.insertAdjacentHTML('beforeend', err.message);
    })
    
}


document.getElementById('btn').addEventListener("click", () => {
    document.querySelector(".countries").innerHTML = "";
    const inputCountry = document.getElementById('inputCountry').value;
    getCountry(inputCountry);
})

