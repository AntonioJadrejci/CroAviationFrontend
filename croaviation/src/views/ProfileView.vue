<template>
  <v-card>
    <v-toolbar color="deep-purple darken-4" dark flat>
      <v-toolbar-title>Profile</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeProfile">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-avatar size="150">
        <v-img :src="profileImage || 'https://via.placeholder.com/150'" />
      </v-avatar>
      <h1 class="mt-4">{{ username }}</h1>
      <p>Number of Planes Posted: {{ numberOfPlanes }}</p>
      <v-file-input
        v-model="newProfileImage"
        label="Upload Profile Image"
        accept="image/*"
      ></v-file-input>
      <v-btn color="primary" @click="uploadImage">Upload</v-btn>
      <v-btn color="error" @click="deleteAccount" class="mt-4"
        >Delete Your Account</v-btn
      >
    </v-card-text>
  </v-card>
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
      newProfileImage: null, // Dodano za upload slike
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
      const formData = new FormData();
      formData.append("profileImage", this.newProfileImage);

      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.post(
          "http://localhost:3000/api/upload-profile-image",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.profileImage = response.data.profileImage; // Ažuriraj profilnu sliku
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
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
          this.$emit("close-profile");
          this.$router.push("/");
        } catch (error) {
          console.error("Error deleting account:", error);
        }
      }
    },
    closeProfile() {
      this.$emit("close-profile");
    },
  },
};
</script>