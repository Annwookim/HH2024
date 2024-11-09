const locations = [
    { name: "Central Park, New York, USA", lat: 40.785091, lng: -73.968285 },
    { name: "Hyde Park, London, UK", lat: 51.507268, lng: -0.165730 },
    { name: "Kyoto Gardens, Japan", lat: 35.011636, lng: 135.768029 },
    { name: "Santorini, Greece", lat: 36.393156, lng: 25.461509 }
];

function getRandomLocation() {
    return locations[Math.floor(Math.random() * locations.length)];
}

async function getRecommendation() {
    const location = getRandomLocation();

    // Fetch the Street View image URL from the server
    const streetViewResponse = await fetch('http://localhost:3001/street-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: location.lat, lng: location.lng })
    });

    const streetViewData = await streetViewResponse.json();

    // Fetch the recommendation message from the server
    const chatResponse = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: { name: location.name, imageUrl: streetViewData.streetViewUrl } })
    });

    const chatData = await chatResponse.json();
    return chatData;
}

document.getElementById("send-button").addEventListener("click", async () => {
    const userMessage = document.getElementById("user-input").value;
    if (!userMessage) return;

    // Display user's message
    const userMessageElem = document.createElement("div");
    userMessageElem.className = "message user-message";
    userMessageElem.innerText = userMessage;
    document.getElementById("chat-output").appendChild(userMessageElem);
    document.getElementById("user-input").value = "";

    // Display bot's response
    const { text, imageUrl } = await getRecommendation();
    const botMessageElem = document.createElement("div");
    botMessageElem.className = "message bot-message";
    botMessageElem.innerText = text;

    const imageElem = document.createElement("img");
    imageElem.src = imageUrl;
    imageElem.alt = "Street View Image";
    imageElem.style.width = "100%";

    document.getElementById("chat-output").appendChild(botMessageElem);
    document.getElementById("chat-output").appendChild(imageElem);
    document.getElementById("chat-output").scrollTop = document.getElementById("chat-output").scrollHeight;
});


