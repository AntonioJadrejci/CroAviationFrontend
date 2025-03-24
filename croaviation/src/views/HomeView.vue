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
      <AddPlaneView @close-add-plane="showAddPlane = false" />
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AddPlaneView from "@/views/AddPlaneView.vue";

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
    currentImage: require("@/assets/hr.png"), // Početna slika
    cities: [
      "ZAGREB",
      "DUBROVNIK",
      "SPLIT",
      "ZADAR",
      "PULA",
      "RIJEKA",
      "OSIJEK",
    ], // Lista gradova
  }),

  methods: {
    // Metoda za navigaciju na homepage i osvježavanje stranice
    goToHome() {
      if (this.$route.path !== "/") {
        // Ako korisnik nije na homepageu, navigiraj na homepage
        this.$router.push("/");
      } else {
        // Ako je korisnik već na homepageu, osvježi stranicu
        window.location.reload();
      }
      // Vrati sliku na početnu
      this.currentImage = require("@/assets/hr.png");
    },

    // Metoda za prijavu/odjavu
    handleAuth() {
      if (this.isLoggedIn) {
        // Odjava korisnika
        localStorage.removeItem("authToken");
        this.isLoggedIn = false;
      } else {
        // Prijava korisnika
        this.showLogin = true;
      }
    },

    // Metoda za navigaciju na stranicu "AIRPORTS"
    goToAirports() {
      this.showCities = !this.showCities; // Promjena stanja za prikaz gradova
    },

    // Metoda za promjenu slike grada
    changeCityImage(city) {
      const cityImageMap = {
        ZAGREB: "Zagreb.jpg",
        DUBROVNIK: "Dubrovnik.jpg",
        SPLIT: "Split.jpg",
        ZADAR: "Zadar.jpg",
        PULA: "Pula.jpg",
        RIJEKA: "Rijeka.jpg",
        OSIJEK: "Osijek.jpg",
      };

      // Postavi sliku grada
      this.currentImage = require(`@/assets/${cityImageMap[city]}`);
    },

    // Metoda za navigaciju na stranicu "PROFILE"
    goToProfile() {
      this.showProfile = true; // Otvori ProfileView u dialogu
    },

    // Metoda za navigaciju na stranicu "ADD A PLANE"
    goToAddPlane() {
      this.showAddPlane = true; // Otvori AddPlaneView u dialogu
    },

    // Metoda za rukovanje uspješnom prijavom
    handleLoginSuccess() {
      this.isLoggedIn = true;
      this.showLogin = false;
    },

    // Metoda za rukovanje uspješnom registracijom
    handleRegisterSuccess() {
      this.isLoggedIn = true;
      this.showRegister = false;
    },
  },

  async mounted() {
    try {
      // Slanje zahtjeva na backend
      const response = await axios.get("http://localhost:3000/api/endpoint"); // Promijenjeno na puni URL
      this.message = response.data.message; // Postavi poruku s backenda
    } catch (error) {
      console.error("Došlo je do greške pri dohvatu podataka:", error);
      this.message = "Greška pri dohvatu podataka s backenda."; // Prikaži grešku korisniku
    }

    // Provjera da li je korisnik prijavljen
    const token = localStorage.getItem("authToken");
    if (token) {
      this.isLoggedIn = true;
    }
  },
};
</script>

<style scoped>
/* Dodatni stilovi ako su potrebni */
.bg-black {
  background-color: black;
}

.white--text {
  color: white;
}

.fill-height {
  height: 100vh;
}

/* Custom stil za gumbove */
.custom-button {
  background-color: #4a148c !important; /* Boja #4A148C */
  color: white !important; /* Bijeli tekst */
  font-size: 1.5rem; /* Veći font */
  padding: 24px 0; /* Veći padding */
  margin: 8px 0; /* Razmak između gumbova */
}

.ml-8 {
  margin-left: 32px; /* Prilagodite marginu prema potrebi */
}
</style>