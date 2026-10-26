const searchInput = document.querySelector("#wheather-search");
const form = document.querySelector("form");
const button = document.querySelector("button");

form.addEventListener("submit", function(event) {
            event.preventDefault();
            const query = searchInput.value.trim();
            fetchWeather(query);
        });


async function fetchWeather(searchInput) {
     const MY_API_KEY = "348db0259f011c2e053737f909642d5f";

     const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=metric&appid=${MY_API_KEY}`;


     try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`City not found (status: ${response.status})`)
        }

        const data = await response.json();


        const container = document.getElementById("container");

const h1 = document.createElement("h1");
const h2 = document.createElement("h2");
const p1 = document.createElement("p");
const p2 = document.createElement("p");


h1.textContent = searchInput;
h2.textContent = `Wheather Data: ${data}`;
p1.textContent = `Temperature in ${data.name}: ${data.main.temp}°C`;
p2.textContent = `Condition: ${data.weather[0].description}`;

container.append(h1, h2, p1, p2);

        return data;
     } catch (error) {
        console.error("Error fetching wheather:", error.message);
     }
 }