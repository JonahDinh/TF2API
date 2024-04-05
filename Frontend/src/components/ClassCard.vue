<!-- eslint-disable max-len -->
<!-- ClassCard.vue -->
<template>
  <b-card :key="classItem.name" class="custom-card" @mouseover="onMouseOver" @mouseleave="onMouseLeave" @focusin="onMouseOver" @focusout="onMouseLeave">
    <b-row>
      <b-col md="4" class="image-col">
        <!-- Add your image here -->
        <img :src="`/images/${classItem.name}.png`" alt="Class Image" class="class-image" :class="{'grow': isHovered}"/>
      </b-col>
      <b-col md="8" class="info-col" :class="{'grow': isHovered}">
        <p class="font-weight-bold font-size-huge">{{ classItem.name }}</p>
        <p><strong>Category:</strong> {{ classItem.category }}</p>
        <p><strong>Base Health:</strong> {{ classItem.baseHealth }}</p>
        <p><strong>Base Speed:</strong> {{ classItem.baseSpeed }}</p>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  props: {
    classItem: Object, // Accept classItem as a prop
  },
  data() {
    return {
      isHovered: false,
    };
  },
  methods: {
    onMouseOver() {
      this.isHovered = true;
    },
    onMouseLeave() {
      this.isHovered = false;
    },
  },
};
</script>

<style scoped>
.custom-card {
  margin-bottom: 20px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f54444;
  overflow: hidden;
}

.custom-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(190, 39, 39, 0.2);
}

.image-col {
  display: flex;
  align-items: center;
}

.class-image {
  width: 100%;
  max-height: 200px; /* Set a maximum height for the image */
  object-fit: contain; /* Display the whole image without cropping */
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
}

.custom-card:hover .class-image {
  transform: scale(1.1);
}

.info-col {
  padding: 1.5rem; /* Increase padding for better spacing */
  transition: transform 0.3s ease-in-out;
}

.custom-card:hover .info-col {
  transform: scale(1.1);
}

.grow {
  transform: scale(1.1);
}

.font-weight-bold {
  font-weight: bold;
}

.font-size-huge {
  font-size: 24px;
  color: #333; /* Adjust the color as needed */
}
</style>
