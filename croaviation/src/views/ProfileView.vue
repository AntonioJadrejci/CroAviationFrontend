<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-avatar size="150">
          <v-img :src="profileImage || 'https://via.placeholder.com/150'" />
        </v-avatar>
        <h1 class="mt-4">{{ username }}</h1>
        <p>Number of Planes Posted: {{ numberOfPlanes }}</p>
        <v-btn color="primary" @click="uploadImage">Upload Profile Image</v-btn>
        <v-btn color="error" @click="deleteAccount" class="mt-4">Delete Your Account</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfileView",
  data() {
    return {
      username: "",
      profileImage: "",
      numberOfPlanes: 0,
    };
  },
  async mounted() {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await axios.get("http://localhost:3000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.username = response.data.username;
        this.profileImage = response.data.profileImage;
        this.numberOfPlanes = response.data.numberOfPlanes;
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
  },
  methods: {
    async uploadImage() {
      // Implementacija za upload slike
    },
    async deleteAccount() {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          await axios.delete("http://localhost:3000/api/delete-account", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          localStorage.removeItem("authToken");
          this.$router.push("/");
        } catch (error) {
          console.error("Error deleting account:", error);
        }
      }
    },
  },
};
</script>