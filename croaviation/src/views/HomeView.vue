<template>
  <v-app>
    <!-- Gornja traka (App Bar) -->
    <v-app-bar app color="pink" dark class="px-0">
      <!-- Logo on the left -->
      <div style="height: 50px; display: flex; align-items: center">
        <v-btn
          @click="goToHome"
          icon
          class="ma-0 pa-0"
          style="min-width: 0; width: 30%; height: 100%"
        >
          <v-img
            :src="require('../assets/CroLogo.png')"
            contain
            height="50"
            style="cursor: pointer; margin-left: 0"
          />
        </v-btn>
      </div>

      <!-- This will push everything after it to the right -->
      <v-spacer></v-spacer>

      <!-- Login/Logout button on the right -->
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
          <v-btn
            color="deep-purple darken-4"
            x-large
            block
            class="mb-4 custom-button"
            @click="goToAirports"
          >
            AIRPORTS
          </v-btn>

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

          <v-btn
            color="deep-purple darken-4"
            x-large
            block
            class="custom-button"
            @click="showAbout = true"
          >
            ABOUT
          </v-btn>

          <v-alert v-if="message" type="success" class="mt-4">
            {{ message }}
          </v-alert>
        </v-col>

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

    <!-- City Planes Dialog -->
    <v-dialog
      v-model="showCityPlanesDialog"
      max-width="800"
      scrollable
      persistent
    >
      <v-card dark color="black">
        <v-toolbar color="deep-purple darken-4">
          <v-toolbar-title>{{ currentCity }} Planes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showCityPlanesDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text v-if="selectedCityPlanes.length > 0">
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="plane in selectedCityPlanes"
              :key="plane._id"
            >
              <v-card
                @click="showPlaneDetails(plane)"
                color="deep-purple darken-3"
                class="plane-card"
              >
                <v-img
                  :src="getPlaneImageUrl(plane.planeImage)"
                  height="150"
                  contain
                  class="plane-image"
                ></v-img>
                <v-card-title class="white--text text-subtitle-1">
                  {{ plane.planeModel }}
                </v-card-title>
                <v-card-subtitle class="white--text">
                  {{ plane.airline }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else class="text-center">
          <v-alert type="info"
            >No planes found for {{ currentCity }} airport.</v-alert
          >
        </v-card-text>
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
    showPlaneDetailsDialog: false,
    showCityPlanesDialog: false,
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
      this.selectedCityPlanes = [];
      this.currentCity = null;
      this.showCityPlanesDialog = false;
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
      await this.fetchPlanesForCity(city.toLowerCase());
      this.showCityPlanesDialog = true;
    },

    async fetchPlanesForCity(city) {
      try {
        console.log(`Fetching planes for ${city}`); // Debug log
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}api/planes/${city}`
        );
        console.log("Planes response:", response.data); // Debug log
        this.selectedCityPlanes = response.data;
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
        await axios.get(`${process.env.VUE_APP_API_BASE_URL}api/profile`);
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
      // Koristite konzistentno process.env.VUE_APP_API_BASE_URL
      return `${process.env.VUE_APP_API_BASE_URL}${imagePath.replace(
        /^uploads[\\/]/,
        ""
      )}`;
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
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}api/health`
      );
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
/* Add this to your existing styles */
.v-app-bar {
  padding-left: 0 !important;
}

.v-toolbar__content {
  padding-left: 0 !important;
}

.bg-black {
  background-color: black;
}

.white--text {
  color: white !important;
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

.plane-card {
  height: 100%;
  transition: transform 0.3s;
  cursor: pointer;
}

.plane-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.plane-image {
  background-color: #121212;
}

.text-subtitle-1 {
  font-size: 1rem !important;
  line-height: 1.5;
}
</style>