<template>
  <b-container style="padding-bottom: 50px">
    <h1 class="page-title">Classes</h1>
    <!-- Filter bar -->
    <b-form-group label="Filter by Category">
      <b-form-radio-group v-model="selectedCategory">
        <b-form-radio value="">All</b-form-radio>
        <b-form-radio :value="category" v-for="category
          in uniqueCategories" :key="category">{{ category }}</b-form-radio>
      </b-form-radio-group>
    </b-form-group>

    <!-- Display filtered class cards -->
    <class-card v-for="item in filteredClasses" :key="item.name" :class-item="item" />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ClassCard from '@/components/ClassCard.vue'; // Import the new component
import { Class } from '@/models/Class'; // Import your Class definition
import Background from '@/components/Background.vue';

@Component({
  components: {
    Background,
    ClassCard, // Register the new component
  },
})
export default class Product extends Vue {
  // Initialize provider as an empty array
  provider: Class[] = [];

  selectedCategory: string | null = null;

  mounted() {
    // Fetch data when the component is mounted
    this.fetchData();
  }

  fetchData() {
    // Assuming your API returns an array of Class objects
    fetch('http://localhost:3004/classes')
      .then((res) => res.json())
      .then((data) => {
        // Set the fetched data to the provider array
        this.provider = data;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  // Computed property to get unique categories
  get uniqueCategories() {
    return [...new Set(this.provider.map((item) => item.category))];
  }

  // Computed property to filter classes based on selected category
  get filteredClasses() {
    if (!this.selectedCategory || this.selectedCategory === '') {
      return this.provider; // Return all classes if no category selected or "All" selected
    }

    return this.provider.filter((item) => item.category === this.selectedCategory);
  }
}
</script>

<style scoped>
.page-title {
  text-align: center;
  font-size: 8em;
  margin-bottom: 10px;
  color: #333;
}
</style>
