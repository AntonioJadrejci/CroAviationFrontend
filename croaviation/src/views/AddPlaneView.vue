<template>
  <v-card>
    <v-toolbar color="deep-purple darken-4" dark flat>
      <v-toolbar-title>Add a Plane</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeAddPlane">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="submitPlane">
        <v-select
          v-model="selectedAirport"
          :items="airports"
          label="Zračna luka"
          required
          :rules="[(v) => !!v || 'Zračna luka je obavezna']"
        ></v-select>

        <v-text-field
          v-model="planeModel"
          label="Model aviona"
          required
          :rules="[(v) => !!v || 'Model aviona je obavezan']"
        ></v-text-field>

        <v-text-field
          v-model="airline"
          label="Aviokompanija"
          required
          :rules="[(v) => !!v || 'Aviokompanija je obavezna']"
        ></v-text-field>

        <v-text-field
          v-model="registration"
          label="Registracija aviona"
          required
          :rules="[(v) => !!v || 'Registracija je obavezna']"
        ></v-text-field>

        <v-menu
          ref="arrivalMenu"
          v-model="arrivalMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="arrivalDate"
              label="Datum dolaska"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :rules="[(v) => !!v || 'Datum dolaska je obavezan']"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="arrivalDate"
            no-title
            scrollable
            @input="arrivalMenu = false"
          ></v-date-picker>
        </v-menu>

        <v-menu
          ref="departureMenu"
          v-model="departureMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="departureDate"
              label="Datum odlaska"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :rules="[(v) => !!v || 'Datum odlaska je obavezan']"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="departureDate"
            no-title
            scrollable
            @input="departureMenu = false"
          ></v-date-picker>
        </v-menu>

        <v-file-input
          v-model="planeImage"
          label="Slika aviona"
          accept="image/*"
          prepend-icon="mdi-camera"
          :rules="[
            (v) => !!v || 'Slika je obavezna',
            (v) => !v || v.size < 2000000 || 'Slika mora biti manja od 2 MB',
          ]"
        ></v-file-input>

        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="loading"
        >
          Upload
        </v-btn>

        <v-alert v-if="errorMessage" type="error" class="mt-4">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="successMessage" type="success" class="mt-4">
          {{ successMessage }}
        </v-alert>
      </v-form>
    </v-card-text>
  </v-card>
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
      arrivalDate: new Date().toISOString().substr(0, 10),
      departureDate: new Date().toISOString().substr(0, 10),
      arrivalMenu: false,
      departureMenu: false,
      planeImage: null,
      loading: false,
      errorMessage: "",
      successMessage: "",
      airports: [
        "Zagreb",
        "Dubrovnik",
        "Split",
        "Zadar",
        "Pula",
        "Rijeka",
        "Osijek",
      ],
    };
  },
  methods: {
    async submitPlane() {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const formData = new FormData();
        formData.append("airport", this.selectedAirport);
        formData.append("planeModel", this.planeModel);
        formData.append("airline", this.airline);
        formData.append("registration", this.registration);
        formData.append("arrivalDate", this.arrivalDate);
        formData.append("departureDate", this.departureDate);

        if (this.planeImage) {
          // Dodajemo sliku sa originalnim imenom i ekstenzijom
          const fileName = `${Date.now()}-${this.planeImage.name.replace(
            /\s+/g,
            "-"
          )}`;
          formData.append("planeImage", this.planeImage, fileName);
        }

        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}api/add-plane`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.successMessage = "Plane added successfully!";
        setTimeout(() => {
          this.$emit("close-add-plane");
          this.$emit("plane-added", response.data); // Možete proslijediti podatke o novom avionu
        }, 1500);
      } catch (error) {
        console.error("Error adding plane:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "Error adding plane. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    closeAddPlane() {
      this.$emit("close-add-plane");
    },
  },
};
</script>

<style scoped>
.v-card {
  max-width: 800px;
  margin: 0 auto;
}

.v-text-field,
.v-select {
  margin-bottom: 16px;
}

.v-btn {
  margin-top: 16px;
}
</style>