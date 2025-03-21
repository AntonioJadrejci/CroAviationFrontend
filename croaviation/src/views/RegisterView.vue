<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="deep-purple darken-4" dark flat>
            <v-toolbar-title>Registracija</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="username"
                label="Korisničko ime"
                required
              ></v-text-field>
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
                Registriraj se
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="goToLogin">Prijavi se</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/register",
          {
            username: this.username,
            email: this.email,
            password: this.password,
          }
        );

        const token = response.data.token;
        localStorage.setItem("authToken", token);
        this.$router.push("/");
      } catch (error) {
        console.error("Greška pri registraciji:", error);
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>