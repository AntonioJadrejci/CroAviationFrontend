<template>
  <v-app>
    <!-- Gornja traka (App Bar) -->
    <v-app-bar app color="black" dark>
      <!-- Logo u gornjem lijevom kutu -->
      <v-img
        :src="require('../assets/CroLogo.png')"
        contain
        height="50"
        class="ml-0"
        @click="goToHome"
        style="cursor: pointer; position: absolute; right: 1050px"
      />

      <v-spacer></v-spacer>
      <!-- Razmak između loga i gumba -->

      <!-- Gumb za prijavu/odjavu u gornjem desnom kutu -->
      <v-btn text @click="handleAuth">
        <v-icon left>{{
          isLoggedIn ? "mdi-account-circle" : "mdi-login"
        }}</v-icon>
        <span>{{ isLoggedIn ? "Log out" : "Log in" }}</span>
      </v-btn>
    </v-app-bar>

    <!-- Glavni sadržaj -->
    <v-container fluid class="bg-black fill-height">
      <v-row align="center" justify="center" class="fill-height">
        <!-- Lijeva polovica (sadržaj) -->
        <v-col cols="12" md="6" class="text-center">
          <!-- Gumb "AIRPORTS" -->
          <v-btn
            color="deep-purple darken-4"
            x-large
            block
            class="mb-4 custom-button"
            @click="goToAirports"
          >
            AIRPORTS
          </v-btn>

          <!-- Prikaz gradova ispod AIRPORTS buttona -->
          <v-row v-if="showCities" class="ml-8">
            <v-col cols="12">
              <v-btn
                v-for="city in cities"
                :key="city"
                color="deep-purple lighten-1"
                x-large
                block
                class="mb-2 custom-button"
                @click="changeCityImage(city)"
              >
                {{ city }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- Prikaz aviokompanija ispod gradova -->
          <v-row v-if="showAirlines" class="ml-8">
            <v-col cols="12">
              <v-btn
                v-for="airline in airlines"
                :key="airline"
                color="deep-purple lighten-1"
                x-large
                block
                class="mb-2 custom-button"
                @click="goToAirline(airline)"
              >
                {{ airline }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- Prikaz objava za odabrani grad -->
          <v-row v-if="selectedCityPlanes.length > 0" class="ml-8">
            <v-col cols="12">
              <v-card
                v-for="plane in selectedCityPlanes"
                :key="plane._id"
                class="mb-4"
                @click="showPlaneDetails(plane)"
              >
                <v-img
                  :src="getPlaneImageUrl(plane.planeImage)"
                  height="200"
                  contain
                ></v-img>
                <v-card-title>{{ plane.planeModel }}</v-card-title>
                <v-card-subtitle>{{ plane.airline }}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>

          <!-- Gumb "PROFILE" (prikazuje se samo ako je korisnik prijavljen) -->
          <v-btn
            v-if="isLoggedIn"
            color="deep-purple darken-4"
            x-large
            block
            class="mb-4 custom-button"
            @click="goToProfile"
          >
            PROFILE
          </v-btn>

          <!-- Gumb "ADD A PLANE" (prikazuje se samo ako je korisnik prijavljen) -->
          <v-btn
            v-if="isLoggedIn"
            color="deep-purple darken-4"
            x-large
            block
            class="mb-4 custom-button"
            @click="goToAddPlane"
          >
            ADD A PLANE
          </v-btn>

          <!-- Gumb "ABOUT" -->
          <v-btn
            color="deep-purple darken-4"
            x-large
            block
            class="custom-button"
            @click="showAbout = true"
          >
            ABOUT
          </v-btn>

          <!-- Dodano za prikaz poruke s backenda -->
          <v-alert v-if="message" type="success" class="mt-4">
            {{ message }}
          </v-alert>
        </v-col>

        <!-- Desna polovica (slika) -->
        <v-col cols="12" md="6" class="text-center">
          <v-img :src="currentImage" contain height="500" />
        </v-col>
      </v-row>
    </v-container>

    <!-- ABOUT dialog -->
    <v-dialog v-model="showAbout" max-width="600">
      <v-card>
        <v-card-title class="headline">About CroAviation</v-card-title>
        <v-card-text>
          Welcome to CroAviation – your guide to airports and airlines in
          Croatia. Discover which airlines fly to each port, view aircraft
          details including model, registration and route, and contribute by
          adding new data. CroAviation is the perfect choice for all aviation
          lovers!
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="deep-purple darken-4" text @click="showAbout = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Login dialog -->
    <LoginView
      :showLogin="showLogin"
      @close-login="showLogin = false"
      @login-success="handleLoginSuccess"
      @go-to-register="showRegister = true"
    />

    <!-- Register dialog -->
    <RegisterView
      :showRegister="showRegister"
      @close-register="showRegister = false"
      @register-success="handleRegisterSuccess"
      @go-to-login="showLogin = true"
    />

    <!-- Profile dialog -->
    <v-dialog v-model="showProfile" max-width="600" persistent>
      <ProfileView @close-profile="showProfile = false" />
    </v-dialog>

    <!-- Add Plane dialog -->
    <v-dialog v-model="showAddPlane" max-width="800" persistent>
      <AddPlaneView
        @close-add-plane="showAddPlane = false"
        @plane-added="refreshPlanes"
      />
    </v-dialog>

    <!-- Plane Details dialog -->
    <v-dialog v-model="showPlaneDetailsDialog" max-width="600">
      <v-card v-if="selectedPlane">
        <v-img
          :src="getPlaneImageUrl(selectedPlane.planeImage)"
          height="300"
          contain
        ></v-img>
        <v-card-title>{{ selectedPlane.planeModel }}</v-card-title>
        <v-card-subtitle>
          <div>Airline: {{ selectedPlane.airline }}</div>
          <div>Registration: {{ selectedPlane.registration }}</div>
          <div>Arrival Date: {{ formatDate(selectedPlane.arrivalDate) }}</div>
          <div>
            Departure Date: {{ formatDate(selectedPlane.departureDate) }}
          </div>
          <div>Posted by: {{ selectedPlane.username || "Unknown" }}</div>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="deep-purple darken-4"
            text
            @click="showPlaneDetailsDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AddPlaneView from "@/views/AddPlaneView.vue";
import axios from "axios";

export default {
  name: "HomeView",
  components: {
    LoginView,
    RegisterView,
    ProfileView,
    AddPlaneView,
  },
  data: () => ({
    message: "",
    isLoggedIn: false,
    showAbout: false,
    showLogin: false,
    showRegister: false,
    showCities: false,
    showProfile: false,
    showAddPlane: false,
    showAirlines: false,
    showPlaneDetailsDialog: false,
    currentImage: require("@/assets/hr.png"),
    cities: [
      "ZAGREB",
      "DUBROVNIK",
      "SPLIT",
      "ZADAR",
      "PULA",
      "RIJEKA",
      "OSIJEK",
    ],
    airlines: [],
    selectedCityPlanes: [],
    selectedPlane: null,
    currentCity: null,
  }),

  methods: {
    goToHome() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      } else {
        window.location.reload();
      }
      this.currentImage = require("@/assets/hr.png");
      this.showCities = false;
      this.showAirlines = false;
      this.selectedCityPlanes = [];
      this.currentCity = null;
    },

    handleAuth() {
      if (this.isLoggedIn) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        this.isLoggedIn = false;
        window.location.reload();
      } else {
        this.showLogin = true;
      }
    },

    goToAirports() {
      this.showCities = !this.showCities;
      this.showAirlines = false;
      this.selectedCityPlanes = [];
      this.currentCity = null;
    },

    async changeCityImage(city) {
      this.currentCity = city;
      const cityImageMap = {
        ZAGREB: "Zagreb.jpg",
        DUBROVNIK: "Dubrovnik.jpg",
        SPLIT: "Split.jpg",
        ZADAR: "Zadar.jpg",
        PULA: "Pula.jpg",
        RIJEKA: "Rijeka.jpg",
        OSIJEK: "Osijek.jpg",
      };
      this.currentImage = require(`@/assets/${cityImageMap[city]}`);

      try {
        // Dohvati aviokompanije
        const airlinesResponse = await axios.get(
          `http://localhost:3000/api/airlines/${city.toLowerCase()}`
        );
        this.airlines = airlinesResponse.data;
        this.showAirlines = true;

        // Dohvati sve avione za odabrani grad
        await this.fetchPlanesForCity(city.toLowerCase());
      } catch (error) {
        console.error("Error fetching data:", error);
        this.airlines = [];
        this.selectedCityPlanes = [];
        this.showAirlines = false;
      }
    },

    async fetchPlanesForCity(city) {
      try {
        const planesResponse = await axios.get(
          `http://localhost:3000/api/planes/${city}`
        );
        this.selectedCityPlanes = planesResponse.data;
      } catch (error) {
        console.error("Error fetching planes:", error);
        this.selectedCityPlanes = [];
      }
    },

    async refreshPlanes() {
      if (this.currentCity) {
        await this.fetchPlanesForCity(this.currentCity.toLowerCase());
      }
    },

    goToAirline(airline) {
      const city = this.cities.find((c) =>
        this.currentImage.includes(c.toLowerCase() + ".jpg")
      );
      if (city) {
        this.$router.push(`/airport/${city.toLowerCase()}/${airline}`);
      }
    },

    goToProfile() {
      this.showProfile = true;
    },

    goToAddPlane() {
      this.showAddPlane = true;
    },

    handleLoginSuccess() {
      this.isLoggedIn = true;
      this.showLogin = false;
      this.checkTokenValidity();
    },

    handleRegisterSuccess() {
      this.isLoggedIn = true;
      this.showRegister = false;
      this.checkTokenValidity();
    },

    async checkTokenValidity() {
      try {
        await axios.get("http://localhost:3000/api/profile");
      } catch (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          this.isLoggedIn = false;
        }
      }
    },

    getPlaneImageUrl(imagePath) {
      if (!imagePath) return require("@/assets/no-image.png");
      if (imagePath.startsWith("http")) return imagePath;
      return `http://localhost:3000/${imagePath}`;
    },

    showPlaneDetails(plane) {
      this.selectedPlane = plane;
      this.showPlaneDetailsDialog = true;
    },

    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },

  async mounted() {
    try {
      const response = await axios.get("http://localhost:3000/api/health");
      this.message = response.data.status;
    } catch (error) {
      console.error("Došlo je do greške pri dohvatu podataka:", error);
      this.message = "Greška pri dohvatu podataka s backenda.";
    }

    const token = localStorage.getItem("authToken");
    if (token) {
      this.isLoggedIn = true;
      this.checkTokenValidity();
    }
  },
};
</script>

<style scoped>
.bg-black {
  background-color: black;
}

.white--text {
  color: white;
}

.fill-height {
  height: 100vh;
}

.custom-button {
  background-color: #4a148c !important;
  color: white !important;
  font-size: 1.5rem;
  padding: 24px 0;
  margin: 8px 0;
}

.ml-8 {
  margin-left: 32px;
}
</style>