function showContent(type) {
    const content = {
        problem: "Urbanization is accelerating globally, leading to increased emissions, worsening air quality, and rising urban temperatures. Without proper intervention, these challenges will have long-term environmental and health consequences.",
        motivation: "Understanding the relationship between urbanization and climate change is crucial. Our study aims to identify key factors influencing urban climate trends and propose sustainable solutions to mitigate negative impacts."
    };

    document.getElementById("displayText").innerText = content[type];
}