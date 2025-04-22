<template>
  <v-dialog :value="showLogin" max-width="600" persistent @input="closeLogin">
    <v-card>
      <v-toolbar color="deep-purple darken-4" dark flat>
        <v-toolbar-title>Prijava</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeLogin">
          <v-icon>mdi-close</v-icon>
        </v-btn>
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
            label="Pasword"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" color="deep-purple darken-4" block dark>
            Log in
          </v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="goToRegister">Register</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    showLogin: Boolean,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}api/login`,
          {
            email: this.email,
            password: this.password,
          }
        );

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        this.$emit("login-success");
        this.closeLogin();
      } catch (error) {
        console.error("Greška pri prijavi:", error);
      }
    },
    goToRegister() {
      this.$emit("go-to-register");
    },
    closeLogin() {
      this.$emit("close-login");
    },
  },
};
</script>