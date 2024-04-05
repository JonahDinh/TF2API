<!-- eslint-disable -->
<template>
  <b-container>
    <h1>Weapons</h1>
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



    <b-modal ref="editModal" title="Edit Weapon" hide-footer no-close-on-backdrop no-close-on-esc>
      <b-form @submit.stop.prevent="editItem">
        <b-form-group label="Name" label-for="editWeaponName">
          <b-form-input v-model="selectedWeapon.name" id="editWeaponName" required></b-form-input>
        </b-form-group>

        <b-form-group label="Damage" label-for="editWeaponDamage">
          <b-form-input v-model="selectedWeapon.damage" id="editWeaponDamage" type="number" required></b-form-input>
        </b-form-group>

        <b-form-group label="Ammo Loaded" label-for="editWeaponAmmoLoaded">
          <b-form-input v-model="selectedWeapon.ammoLoaded" id="editWeaponAmmoLoaded" type="number" required></b-form-input>
        </b-form-group>

        <b-form-group label="Ammo Carried" label-for="editWeaponAmmoCarried">
          <b-form-input v-model="selectedWeapon.ammoCarried" id="editWeaponAmmoCarried" type="number" required></b-form-input>
        </b-form-group>

        <b-form-group label="Special Ability" label-for="editWeaponSpecialAbility">
          <b-form-input v-model="selectedWeapon.specialAbility" id="editWeaponSpecialAbility"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Save Changes</b-button>
      </b-form>
    </b-modal>




    <b-modal ref="newModal" title="Create New Weapon" hide-footer no-close-on-backdrop no-close-on-esc>
      <b-form @submit.stop.prevent="createNewWeapon">
        <b-form-group label="Name" label-for="newWeaponName">
          <b-form-input v-model="newWeapon.name" id="newWeaponName" required></b-form-input>
        </b-form-group>

        <b-form-group label="Damage" label-for="newWeaponDamage">
          <b-form-input v-model="newWeapon.damage" id="newWeaponDamage" type="number" required></b-form-input>
        </b-form-group>

        <b-form-group label="Ammo Loaded" label-for="newWeaponAmmoLoaded">
          <b-form-input v-model="newWeapon.ammoLoaded" id="newWeaponAmmoLoaded" type="number" required></b-form-input>
        </b-form-group>

        <b-form-group label="Ammo Carried" label-for="newWeaponAmmoCarried">
          <b-form-input v-model="newWeapon.ammoCarried" id="newWeaponAmmoCarried" type="number" required></b-form-input>
        </b-form-group>

        <b-form-group label="Special Ability" label-for="newWeaponSpecialAbility">
          <b-form-input v-model="newWeapon.specialAbility" id="newWeaponSpecialAbility"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Create Weapon</b-button>
      </b-form>
    </b-modal>


    <b-table

      ref="weaponsTable"
      responsive
      :items="provider"
      :fields="fields"
      :api-url="WEAPON_API"
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
import Weapon from '@/models/Weapon'; // Import the Weapon type from your types file
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
export default class WeaponView extends Mixins(GlobalMixin) {
  $refs!: { weaponTable: BTable, editModal: BModal,
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
    // Adjust this to match your API endpoint for weapons
    return this.callAPI(`${ctx.apiUrl}`);
  }

  selectedWeapon: Weapon = new Weapon();

  fields = [
    { key: 'id', sortable: true },
    { key: 'name', sortable: true },
    { key: 'damage', sortable: true },
    { key: 'ammoLoaded', sortable: true },
    { key: 'ammoCarried', sortable: true },
    { key: 'specialAbility', sortable: true },
    { key: 'Action', sortable: false },
  ];

  newWeapon: any = {
    name: '',
    damage: 0,
    ammoLoaded: 0,
    ammoCarried: 0,
    specialAbility: '',
  };

  openEditModal(item: any): void {
    // Implement your logic to populate the modal with item data
    // For now, we're just opening the modal without specific data
    console.log(item);
    this.selectedWeapon = { ...item };
    this.$refs.editModal.show();
  }

  openNewModal(): void {
    // For a new weapon, reset the newWeapon object
    this.newWeapon = {
      name: '',
      slot: 'Spy Melee',
      damage: 0,
      ammoLoaded: 0,
      ammoCarried: 0,
      specialAbility: '',
    };

    // Opening the new weapon modal
    this.$refs.newModal.show();
  }

  async createNewWeapon() {
    console.log('Create new weapon:', this.newWeapon);
    this.newWeapon.damage = parseInt(this.newWeapon.damage, 10);
    this.newWeapon.ammoLoaded = parseInt(this.newWeapon.ammoLoaded, 10);
    this.newWeapon.ammoCarried = parseInt(this.newWeapon.ammoCarried, 10);
    api.post('/weapons', this.newWeapon)
      .then((response) => {
        console.log('Weapon created successfully:', response.data);
        this.$refs.newModal.hide();
        this.successMessage = `${this.newWeapon.name} created successfully`;
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
          this.errorMessage = 'An error occurred while editing the weapon.';
        }

        // Show failure modal
        this.$refs.failureModal.show();
      });
  }

  async editItem() {
    console.log('Edit item:', this.selectedWeapon);
    this.selectedWeapon.damage = Number(this.selectedWeapon.damage);
    this.selectedWeapon.ammoLoaded = Number(this.selectedWeapon.ammoLoaded);
    this.selectedWeapon.ammoCarried = Number(this.selectedWeapon.ammoCarried);
    if (this.selectedWeapon.id !== undefined) {
      // Use the api instance for the HTTP request
      api.put(`/weapons/${this.selectedWeapon.id}`, this.selectedWeapon)
        .then((response) => {
          console.log('Weapon edited successfully:', response.data);
          this.$refs.editModal.hide();
          // Optionally, update local data or perform other actions

          this.$refs.newModal.hide();
          this.successMessage = `${this.selectedWeapon.name} edited successfully`;
          this.$refs.successModal.show();
        })
        .catch((error) => {
          console.error('Error editing weapon:', error);
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
            this.errorMessage = 'An error occurred while editing the weapon.';
          }

          // Show failure modal
          this.$refs.failureModal.show();
        });
    } else {
      console.error('Selected weapon does not have a valid ID.');
    }
  }

  deleteItem(item: any): void {
    this.selectedWeapon = { ...item };
    // Show the confirmation modal
    this.$refs.confirmDeleteModal.show();
  }

  confirmDelete(): void {
    // Implement your delete logic here
    console.log('Delete item:', this.selectedWeapon);
    // Check if selectedWeapon.id is defined before making the request
    console.log(this.selectedWeapon.id);
    if (this.selectedWeapon.id !== undefined) {
      // Use the api instance for the HTTP request
      api.delete(`/weapons/${this.selectedWeapon.id}`)
        .then((response) => {
          console.log('Weapon Deleted successfully:', response.data);
          this.$refs.confirmDeleteModal.hide();
          // Optionally, update local data or perform other actions
          this.refreshPage();
        })
        .catch((error) => {
          console.error('Error deleting weapon:', error);
        });
    } else {
      console.error('Selected weapon does not have a valid ID.');
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
