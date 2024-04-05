<!-- eslint-disable -->
<template>
  <b-container>
    <h1>Maps</h1>
    <b-button variant="info" @click="openNewModal()">New</b-button>


    <b-modal ref="successModal" no-close-on-backdrop no-close-on-esc @hide="onModalClosed">
      <p>{{ successMessage }}</p>
    </b-modal>

    <b-modal ref="failureModal" no-close-on-backdrop no-close-on-esc>
      <p>{{ errorMessage }}</p>
    </b-modal>

    <b-modal ref="confirmDeleteModal" title="Confirm Delete" hide-footer no-close-on-backdrop no-close-on-esc>
      <p>Are you sure you want to delete this map?</p>
      <b-button variant="danger" @click="confirmDelete">Yes, Delete</b-button>
      <b-button variant="secondary" @click="cancelDelete">Cancel</b-button>
    </b-modal>



    <b-modal ref="editModal" title="Edit Map" hide-footer no-close-on-backdrop no-close-on-esc>
      <b-form @submit.stop.prevent="editItem">
        <b-form-group label="Name" label-for="editMapName">
          <b-form-input v-model="selectedMap.name" id="editMapName" required></b-form-input>
        </b-form-group>
        <b-form-group label="Type" label-for="editMapDamage">
          <b-form-input v-model="selectedMap.type" id="editMapDamage" required></b-form-input>
        </b-form-group>
        <b-form-group label="Setting" label-for="editMapAmmoLoaded">
          <b-form-input v-model="selectedMap.setting" id="editMapAmmoLoaded" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Save Changes</b-button>
      </b-form>
    </b-modal>




    <b-modal ref="newModal" title="Create New Map" hide-footer no-close-on-backdrop no-close-on-esc>
      <b-form @submit.stop.prevent="createNewMap">
        <b-form-group label="Name" label-for="newMapName">
          <b-form-input v-model="newMap.name" id="newMapName" required></b-form-input>
        </b-form-group>

        <b-form-group label="Type" label-for="newMapDamage">
          <b-form-input v-model="newMap.type" id="newMapDamage" required></b-form-input>
        </b-form-group>

        <b-form-group label="Setting" label-for="newMapAmmoLoaded">
          <b-form-input v-model="newMap.setting" id="newMapAmmoLoaded" required></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Create Map</b-button>
      </b-form>
    </b-modal>


    <b-table

      ref="mapsTable"
      responsive
      :items="provider"
      :fields="fields"
      :api-url="MAP_API"
      striped
      hover
      primary-key="id"
      no-provider-sorting
      no-provider-paging
      no-provider-filtering>
      <template v-slot:cell(Action)="data">

        <div>
          <b-button variant="info" @click="openEditModal(data.item)">Edit</b-button>
          <b-button variant="danger" @click="deleteItem(data.item)">Delete</b-button>
        </div>

      </template>

    </b-table>
  </b-container>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Mixins } from 'vue-property-decorator';
import { BvTableCtxObject, BModal, BTable } from 'bootstrap-vue';
import Map from '@/models/Map'; // Import the Map type from your types file
import GlobalMixin from '@/mixins/global-mixin';
import { validate } from 'class-validator';

const api = axios.create({
  baseURL: 'http://localhost:3004',
  headers: {

    Authorization: `Bearer ${localStorage.getItem('steamID')}`, // Include your access token or other credentials here
    'Content-Type': 'application/json',
  },
});

@Component({
  components: {},
})
export default class MapView extends Mixins(GlobalMixin) {
  $refs!: { mapTable: BTable, editModal: BModal,
            newModal: BModal, confirmDeleteModal: BModal,
            successModal: BModal, failureModal: BModal };

  successMessage = '';

  errorMessage= '';

  async validateFormData(formData: object) {
    try {
      const validationErrors = await validate(formData);
      return validationErrors || [];
    } catch (error) {
      console.error('Validation error:', error);
      return [];
    }
  }

  provider(ctx: BvTableCtxObject): Promise<any> {
    // Adjust this to match your API endpoint for maps
    return this.callAPI(`${ctx.apiUrl}`);
  }

  selectedMap: Map = new Map();

  fields = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'type', sortable: true },
    { key: 'setting', sortable: true },
    { key: 'Action', sortable: false },
  ];

  newMap: any = {
    name: '',
    type: '',
    setting: '',
  };

  openEditModal(item: any): void {
    // Implement your logic to populate the modal with item data
    // For now, we're just opening the modal without specific data
    console.log(item);
    this.selectedMap = { ...item };
    this.$refs.editModal.show();
  }

  openNewModal(): void {
    // For a new map, reset the newMap object
    this.newMap = {
      name: 'Map Name',
      type: 'Type Test',
      setting: 'Test',
    };

    // Opening the new map modal
    this.$refs.newModal.show();
  }

  async createNewMap() {
    console.log('Create new map:', this.newMap);
    api.post('/maps', this.newMap)
      .then((response) => {
        console.log('Map created successfully:', response.data);
        this.$refs.newModal.hide();
        this.successMessage = `${this.newMap.name} created successfully`;
        this.$refs.successModal.show();
      })
      .catch((error) => {
        console.error('Error creating weapon:', error);
        this.errorMessage = '';
        if (error.response && error.response.data && error.response.data[0]
          && error.response.data[0].constraints) {
          const { constraints } = error.response.data[0];

          // Iterate through each property of the constraints object
          Object.keys(constraints).forEach((key) => {
            // Append each constraint to the errorMessage
            this.errorMessage += `${constraints[key]} `;
          });
        } else {
          // If constraints object is not present, use a generic error message
          this.errorMessage = 'An error occurred while creating the map.';
        }

        // Show failure modal
        this.$refs.failureModal.show();
      });
  }

  async editItem() {
    console.log('Edit item:', this.selectedMap);
    if (this.selectedMap.id !== undefined) {
      // Use the api instance for the HTTP request
      api.put(`/maps/${this.selectedMap.id}`, this.selectedMap)
        .then((response) => {
          console.log('Map edited successfully:', response.data);
          this.$refs.editModal.hide();
          // Optionally, update local data or perform other actions
          this.refreshPage();
        })
        .catch((error) => {
          console.error('Error creating weapon:', error);
          this.errorMessage = '';
          if (error.response && error.response.data && error.response.data[0]
            && error.response.data[0].constraints) {
            const { constraints } = error.response.data[0];

            // Iterate through each property of the constraints object
            Object.keys(constraints).forEach((key) => {
              // Append each constraint to the errorMessage
              this.errorMessage += `${constraints[key]} `;
            });
          } else {
            // If constraints object is not present, use a generic error message
            this.errorMessage = 'An error occurred while editing the map.';
          }

          // Show failure modal
          this.$refs.failureModal.show();
        });
    } else {
      console.error('Selected map does not have a valid ID.');
    }
  }

  deleteItem(item: any): void {
    this.selectedMap = { ...item };
    // Show the confirmation modal
    this.$refs.confirmDeleteModal.show();
  }

  confirmDelete(): void {
    // Implement your delete logic here
    console.log('Delete item:', this.selectedMap);
    // Check if selectedMap.id is defined before making the request
    console.log(this.selectedMap.id);
    if (this.selectedMap.id !== undefined) {
      // Use the api instance for the HTTP request
      api.delete(`/maps/${this.selectedMap.id}`)
        .then((response) => {
          console.log('Map Deleted successfully:', response.data);
          this.$refs.confirmDeleteModal.hide();
          // Optionally, update local data or perform other actions
          this.refreshPage();
        })
        .catch((error) => {
          console.error('Error deleting map:', error);
        });
    } else {
      console.error('Selected map does not have a valid ID.');
    }
  }

  cancelDelete(): void {
    // Hide the confirmation modal
    this.$refs.confirmDeleteModal.hide();
  }

  onModalClosed() {
    this.refreshPage();
  }

  refreshPage(): void {
    // Refresh Logic here
    window.location.reload();
  }
}

</script>
