<template>
  <v-dialog
    :value="showRegister"
    max-width="600"
    persistent
    @input="closeRegister"
  >
    <v-card>
      <v-toolbar color="deep-purple darken-4" dark flat>
        <v-toolbar-title>Registracija</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeRegister">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    showRegister: Boolean,
  },
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
          `${process.env.VUE_APP_API_BASE_URL}api/register`,
          {
            username: this.username,
            email: this.email,
            password: this.password,
          }
        );

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        this.$emit("register-success");
        this.closeRegister();
      } catch (error) {
        console.error("Greška pri registraciji:", error);
      }
    },
    goToLogin() {
      this.$emit("go-to-login");
    },
    closeRegister() {
      this.$emit("close-register");
    },
  },
};
</script>