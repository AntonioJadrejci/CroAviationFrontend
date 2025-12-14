<template>
  <v-card>
    <v-toolbar color="deep-purple darken-4" dark flat>
      <v-toolbar-title>Profile</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeProfile">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="text-center">
      
      <v-avatar size="150" class="mb-4">
        <v-img :src="getProfileImageUrl(profileImage)" />
      </v-avatar>

      
      <h1 class="mt-4">{{ username }}</h1>

      
      <p>Number of Planes Posted: {{ numberOfPlanes }}</p>

      
      <v-file-input
        v-model="newProfileImage"
        label="Upload Profile Image"
        accept="image/*"
        class="mt-4"
      ></v-file-input>
      <v-btn color="primary" @click="uploadImage">Upload</v-btn>

      
      <v-btn color="error" @click="deleteAccount" class="mt-4">
        Delete Your Account
      </v-btn>
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
      newProfileImage: null, 
    };
  },
  async mounted() {
    
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.username = response.data.username;
        this.profileImage =
          response.data.profileImage || require("@/assets/EmptyProfile.png");
        this.numberOfPlanes = response.data.numberOfPlanes;
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
  },
  methods: {
    
    getProfileImageUrl(imagePath) {
      if (!imagePath) return require("@/assets/EmptyProfile.png");
      if (imagePath.startsWith("http")) return imagePath;
      return `${process.env.VUE_APP_API_BASE_URL}${imagePath}`;
    },

    
    async uploadImage() {
      const formData = new FormData();
      formData.append("profileImage", this.newProfileImage);

      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}api/upload-profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        this.profileImage = response.data.profileImage;
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    },

    
    async deleteAccount() {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          await axios.delete(
            `${process.env.VUE_APP_API_BASE_URL}api/delete-account`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
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

<style scoped>

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 20px auto;
  border: 3px solid white;
}
</style>