<template>
  <v-container fluid class="bg-black fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <!-- Lijeva polovica (sadržaj) -->
      <v-col cols="12" md="6" class="text-center">
        <v-img
          :src="require('../assets/CroLogo.png')"
          class="my-3"
          contain
          height="200"
          @click="goToHome"
          style="cursor: pointer"
        />

        <h1 class="display-2 font-weight-bold mb-3 white--text">Welcome</h1>

        <p class="subheading font-weight-regular white--text">
          For help and collaboration with other developers,
          <br />please join our online
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
            class="white--text"
            >Discord Community</a
          >
        </p>

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