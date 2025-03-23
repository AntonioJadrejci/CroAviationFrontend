<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-form @submit.prevent="submitPlane">
          <v-select
            v-model="selectedAirport"
            :items="airports"
            label="Zračna luka"
            required
          ></v-select>
          <v-text-field v-model="planeModel" label="Model aviona" required></v-text-field>
          <v-text-field v-model="airline" label="Aviokompanija" required></v-text-field>
          <v-text-field v-model="registration" label="Registracija aviona" required></v-text-field>
          <v-date-picker v-model="arrivalDate" label="Datum dolaska" required></v-date-picker>
          <v-date-picker v-model="departureDate" label="Datum odlaska" required></v-date-picker>
          <v-file-input v-model="planeImage" label="Slika aviona" accept="image/*"></v-file-input>
          <v-btn type="submit" color="primary">Upload</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "AddPlaneView",
  data() {
    return {
      selectedAirport: "",
      planeModel: "",
      airline: "",
      registration: "",
      arrivalDate: "",
      departureDate: "",
      planeImage: null,
      airports: ["Zagreb", "Dubrovnik", "Split", "Zadar", "Pula", "Rijeka", "Osijek"],
    };
  },
  methods: {
    async submitPlane() {
      const formData = new FormData();
      formData.append("airport", this.selectedAirport);
      formData.append("planeModel", this.planeModel);
      formData.append("airline", this.airline);
      formData.append("registration", this.registration);
      formData.append("arrivalDate", this.arrivalDate);
      formData.append("departureDate", this.departureDate);
      formData.append("planeImage", this.planeImage);

      const token = localStorage.getItem("authToken");
      try {
        await axios.post("http://localhost:3000/api/add-plane", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        this.$router.push("/profile");
      } catch (error) {
        console.error("Error adding plane:", error);
      }
    },
  },
};
</script>