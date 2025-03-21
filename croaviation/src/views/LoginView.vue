<template>
  <v-overlay :value="true" z-index="100">
    <v-card class="elevation-12">
      <v-toolbar color="deep-purple darken-4" dark flat>
        <v-toolbar-title>Prijava</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Lozinka"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" color="deep-purple darken-4" block dark>
            Prijavi se
          </v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="goToRegister">Registriraj se</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          email: this.email,
          password: this.password,
        });

        const token = response.data.token;
        localStorage.setItem("authToken", token);
        this.$router.push("/");
      } catch (error) {
        console.error("Greška pri prijavi:", error);
      }
    },
    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>