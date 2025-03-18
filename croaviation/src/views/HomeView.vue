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
        style="cursor: pointer"
      />

      <v-spacer></v-spacer>
      <!-- Razmak između loga i gumba -->

      <!-- Gumb za prijavu u gornjem desnom kutu -->
      <v-btn text @click="login">
        <v-icon left>mdi-account-circle</v-icon>
        <!-- Ikona profila -->
        <span>Log in</span>
      </v-btn>
    </v-app-bar>

    <!-- Glavni sadržaj -->
    <v-container fluid class="bg-black fill-height">
      <v-row align="center" justify="center" class="fill-height">
        <!-- Lijeva polovica (sadržaj) -->
        <v-col cols="12" md="6" class="text-center">
          <!-- Gumb "AIRPORTS" -->
          <v-btn color="purple" x-large class="mb-4" @click="goToAirports">
            AIRPORTS
          </v-btn>

          <!-- Gumb "ABOUT" -->
          <v-btn color="purple" x-large @click="goToAbout"> ABOUT </v-btn>

          <!-- Dodano za prikaz poruke s backenda -->
          <v-alert v-if="message" type="success" class="mt-4">
            {{ message }}
          </v-alert>
        </v-col>

        <!-- Desna polovica (slika) -->
        <v-col cols="12" md="6" class="text-center">
          <v-img :src="require('../assets/hr.png')" contain height="500" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",

  data: () => ({
    message: "", // Dodano za pohranu poruke s backenda
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
    },

    // Metoda za prijavu
    login() {
      // Ovdje možete dodati logiku za prijavu (npr. preusmjeravanje na stranicu za prijavu)
      console.log("Kliknuto na Log in");
    },

    // Metoda za navigaciju na stranicu "AIRPORTS"
    goToAirports() {
      console.log("Kliknuto na AIRPORTS");
      // Ovdje možete dodati logiku za navigaciju na stranicu "AIRPORTS"
    },

    // Metoda za navigaciju na stranicu "ABOUT"
    goToAbout() {
      console.log("Kliknuto na ABOUT");
      // Ovdje možete dodati logiku za navigaciju na stranicu "ABOUT"
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
</style>