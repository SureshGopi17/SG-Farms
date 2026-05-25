/* SG Farms Weather & Seasonal Crop Recommendation Engine */

export const WeatherEngine = {
  // Returns simulated live weather for Mukkollu based on system date
  getLiveWeather() {
    const now = new Date();
    const month = now.getMonth(); // 0 = Jan, 4 = May, etc.
    
    let temp = 30;
    let humidity = 65;
    let condition = "Sunny";
    let advice = "";
    let seasonName = "Summer";

    if (month >= 2 && month <= 4) { // March, April, May (Summer)
      temp = 38 + Math.floor(Math.random() * 4); // 38 - 41 °C
      humidity = 45 + Math.floor(Math.random() * 10);
      condition = "Clear Hot Day";
      seasonName = "Summer (Kharif Sowing)";
      advice = "Orchard irrigation is active. High solar radiation speeds up Banganapalli Mango ripening.";
    } else if (month >= 5 && month <= 8) { // June, July, Aug, Sept (Monsoon)
      temp = 29 + Math.floor(Math.random() * 4);
      humidity = 85 + Math.floor(Math.random() * 10);
      condition = "Thunderstorms / Rain";
      seasonName = "Southwest Monsoon";
      advice = "Paddy fields are water-logged. Perfect timing for transplanting HMT Rice seedlings.";
    } else if (month >= 9 && month <= 10) { // Oct, Nov (Post Monsoon / Retreat)
      temp = 28 + Math.floor(Math.random() * 4);
      humidity = 70 + Math.floor(Math.random() * 10);
      condition = "Partly Cloudy";
      seasonName = "Northeast Monsoon";
      advice = "Turmeric root growth is optimal in damp soils. Keep checking for root rot indicators.";
    } else { // Dec, Jan, Feb (Winter)
      temp = 24 + Math.floor(Math.random() * 4);
      humidity = 60 + Math.floor(Math.random() * 8);
      condition = "Mild & Cool Fog";
      seasonName = "Winter (Rabi)";
      advice = "Morning dew helps sweet corn and tomato vine set. Irrigation scheduled every 4 days.";
    }

    return {
      location: "Mukkollu, AP",
      temp,
      humidity,
      condition,
      seasonName,
      advice,
      windSpeed: 12 + Math.floor(Math.random() * 8)
    };
  },

  // Suggests top products based on simulated weather conditions
  getRecommendations(products) {
    const weather = this.getLiveWeather();
    const season = weather.seasonName.toLowerCase();
    
    let recommended = [];

    if (season.includes("summer")) {
      // Mangoes & Papaya are perfect
      recommended = products.filter(p => p.id === "p1" || p.id === "p6");
    } else if (season.includes("monsoon")) {
      // Tomato & Corn
      recommended = products.filter(p => p.id === "p3" || p.id === "p5");
    } else if (season.includes("northeast")) {
      // Turmeric & Rice
      recommended = products.filter(p => p.id === "p4" || p.id === "p2");
    } else {
      // Tomatoes, Corn, Turmeric
      recommended = products.filter(p => p.id === "p3" || p.id === "p5" || p.id === "p4");
    }

    // Fallback if none found
    if (recommended.length === 0) {
      recommended = products.slice(0, 2);
    }

    return {
      weather,
      items: recommended
    };
  }
};
