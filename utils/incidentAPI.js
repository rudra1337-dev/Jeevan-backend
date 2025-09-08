// utils/incidentApi.js
const axios = require("axios");

async function sendIncidentToGoFr(incident) {
  try {
    const response = await axios.post("https://jeevan-gofr-service.onrender.com/incidents", incident);
    return response.data;
  } catch (error) {
    console.error("Error sending incident to GoFr:", error.message);
    throw error;
  }
}

module.exports = { sendIncidentToGoFr };