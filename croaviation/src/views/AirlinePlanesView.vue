<template>
  <v-container fluid class="bg-black fill-height">
    <v-row>
      <v-col cols="12">
        <v-btn
          @click="$router.go(-1)"
          color="deep-purple darken-4"
          class="mb-4"
        >
          Back
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4" v-for="plane in planes" :key="plane._id">
        <v-card @click="selectPlane(plane)" class="mb-4">
          <v-img :src="getPlaneImageUrl(plane.planeImage)" height="200"></v-img>
          <v-card-title>{{ plane.planeModel }}</v-card-title>
          <v-card-subtitle>Posted by: {{ plane.username }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showPlaneDetails" max-width="600">
      <v-card v-if="selectedPlane">
        <v-card-title class="headline">{{
          selectedPlane.planeModel
        }}</v-card-title>
        <v-img
          :src="getPlaneImageUrl(selectedPlane.planeImage)"
          height="300"
        ></v-img>
        <v-card-text>
          <p><strong>Airline:</strong> {{ selectedPlane.airline }}</p>
          <p><strong>Registration:</strong> {{ selectedPlane.registration }}</p>
          <p>
            <strong>Arrival Date:</strong>
            {{ formatDate(selectedPlane.arrivalDate) }}
          </p>
          <p>
            <strong>Departure Date:</strong>
            {{ formatDate(selectedPlane.departureDate) }}
          </p>
          <p><strong>Posted by:</strong> {{ selectedPlane.username }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="deep-purple darken-4"
            text
            @click="showPlaneDetails = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "AirlinePlanesView",
  data() {
    return {
      planes: [],
      selectedPlane: null,
      showPlaneDetails: false,
    };
  },
  async mounted() {
    const { airport, airline } = this.$route.params;
    const response = await this.$api.get(`/api/planes/${airport}/${airline}`);
    this.planes = response.data;
  },
  methods: {
    getPlaneImageUrl(imagePath) {
      if (!imagePath) return require("@/assets/no-image.png");
      if (imagePath.startsWith("http")) return imagePath;

      // Ako putanja već počinje s 'uploads', ne dodajemo još jedan put
      const cleanPath = imagePath.startsWith("uploads/")
        ? imagePath
        : `uploads/${imagePath}`;

      return `${process.env.VUE_APP_API_BASE_URL}${cleanPath}`;
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    },
    selectPlane(plane) {
      this.selectedPlane = plane;
      this.showPlaneDetails = true;
    },
  },
};
</script>

<style scoped>
.bg-black {
  background-color: black;
}
.fill-height {
  min-height: 100vh;
}
</style>