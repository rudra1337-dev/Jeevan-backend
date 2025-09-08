// utils/incidentApi.js
const axios = require("axios");

async function sendIncidentToGoFr(incident) {
  try {
    const response = await axios.post("http://localhost:8000/incidents", incident);
    return response.data;
  } catch (error) {
    console.error("Error sending incident to GoFr:", error.message);
    throw error;
  }
}

module.exports = { sendIncidentToGoFr };