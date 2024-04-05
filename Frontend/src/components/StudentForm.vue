<!-- eslint-disable max-len -->
<!--
This component will act an html form to edit new or existing student objects
The buttons at the bottom are connected to methods that will use axios to make AJAX calls to the student API

VUE JS Directives
v-bind directive - https://vuejs.org/v2/api/#v-bind - 1 way communication from variables to control
v-on directive - https://vuejs.org/v2/api/#v-on - vue event handler hook to call a method
v-model directive - https://vuejs.org/v2/guide/forms.html - 2-way communication from form input to data variable ans vice versa

USING short cuts:
'v-bind:' can be shorted to just use the ':' -- example v-bind:disabled="isNew" can be shortened  :disabled="isNew"
'v-on:' can be shortened to just use @   -- example v-on:click="deleteStudent" can be shortened  @click="deleteStudent"

USING Bootstrap-vue components: https://bootstrap-vue.org/docs/components
b-form-group -- https://bootstrap-vue.org/docs/components/form-group
b-input-group -- https://bootstrap-vue.org/docs/components/input-group
b-input-group-prepend -- https://bootstrap-vue.org/docs/components/input-group#using-prepend-and-append-props
v-b-tooltip directive -- https://bootstrap-vue.org/docs/components/tooltip#v-b-tooltip-directive-usage
b-form-input -- https://bootstrap-vue.org/docs/components/form-input
b-button-group -- https://bootstrap-vue.org/docs/components/button-group
b-button -- https://bootstrap-vue.org/docs/components/button
b-icon animation -- https://bootstrap-vue.org/docs/icons#animated-icons
b-modal -- https://bootstrap-vue.org/docs/components/modal#using-v-model-property
-->

<template>
  <div>
    <!-- FAMILY NAME -->
    <!--    invalid-feedback prop is bound to the data variable object 'violation' and its familyName attribute
        hasErr prop is bound to the computed object 'hasErr' and it's ln attribute-->
    <b-form-group :invalid-feedback="violation.familyName" :has-err="hasErr.fN" class="mb-1">
      <b-input-group>
        <!--    tooltip hovers to the right of the prepend div-->
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.fN">
          <!--    add icon to left of input box and the title attribute is bound to the data variable object 'dt' and its ln attribute-->
          <b-icon-people-fill :title="dt.fN" />
        </b-input-group-prepend>
        <!--    form input, placeholder attribute bound to data variable object 'dt' and its ln attribute
                disabled prop is bound to computed property isDisabled
                value of form input is 2-way bound to the data variable object 'tempStudent' and its familyName attribute
                trim directive removes white space at start or end of user entry
                when a key is pressed down the violation message for the field is cleared thus hiding the violation from the user
                -->
        <b-form-input :placeholder="dt.fN" :has-err="hasErr.fN" :disabled="isDisabled"
                      v-model="tempStudent.familyName" trim @keydown="violation.familyName=null" />
      </b-input-group>
    </b-form-group>

    <!-- GIVEN NAME -->
    <b-form-group :invalid-feedback="violation.givenName" :has-err="hasErr.gN" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.gN">
          <b-icon-person-fill :title="dt.gN" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.gN" :has-err="hasErr.gN" :disabled="isDisabled"
                      v-model="tempStudent.givenName" trim @keydown="violation.givenName=null" />
      </b-input-group>
    </b-form-group>

    <!-- EMAIL -->
    <b-form-group :invalid-feedback="violation.email" :has-err="hasErr.em" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.em">
          <b-icon-envelope-fill :title="dt.em" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.em" :has-err="hasErr.em" :disabled="isDisabled"
                      v-model="tempStudent.email" trim @keydown="violation.email=null" />
      </b-input-group>
    </b-form-group>

    <!-- ADDRESS -->
    <b-form-group :invalid-feedback="violation.address" :has-err="hasErr.sA" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.sA">
          <b-icon-house-fill :title="dt.sA" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.sA" :has-err="hasErr.sA" :disabled="isDisabled"
                      v-model="tempStudent.address" trim @keydown="violation.address=null" />
      </b-input-group>
    </b-form-group>

    <!-- PHONE-->
    <b-form-group :invalid-feedback="violation.phone" :has-err="hasErr.pn" class="mb-1">
      <b-input-group>
        <b-input-group-prepend is-text v-b-tooltip.hover.right="dt.pn">
          <b-icon-telephone-fill :title="dt.pn" />
        </b-input-group-prepend>
        <b-form-input :placeholder="dt.pn" :has-err="hasErr.pn" :disabled="isDisabled"
                      v-model="tempStudent.phone" trim @keydown="violation.phone=null" />
      </b-input-group>
    </b-form-group>

    <!-- BUTTONS -->
    <b-button-group class="w-100 mb-3">
      <!--    save button,  onclick call the saveStudent function
        disabled prop is bound to the computed property 'isDisabled' -->
      <b-button variant="primary" :disabled="isDisabled" @click="saveStudent">
        <!--    use a cloud icon, add a ref (reference) to this icon as 'iconSave' so we can animate it when saveStudent is called
            https://vuejs.org/v2/api/#ref -->
        <b-icon-cloud-arrow-up-fill ref="iconSave" /> Save</b-button>
      <b-button variant="danger" :disabled="isDisabled || isNew" @click="deleteConfirm">
        <!--    use a trash icon, add a ref (reference) to this icon as 'iconDelete' so we can animate it when deleteStudent is called
            https://vuejs.org/v2/api/#ref -->
        <b-icon-trash-fill ref="iconDelete" /> Delete</b-button>
      <b-button variant="primary" :disabled="isDisabled" @click="cancel">
        <b-icon-x-square-fill /> Cancel</b-button>
    </b-button-group>

    <!-- DELETE CONFIRM -- show hide the modal using the showConfirmDelete data variable as a model -->
    <b-modal title="Delete Student" ok-variant="danger" cancel-variant="primary"
             @ok="deleteStudent" v-model="showConfirmDelete">
      <!--    using slots -- https://vuejs.org/v2/guide/components-slots.html
        slot defined in b-modal -- https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots
        modify the buttons that appear in the footer of the modal using pre-defined slots-->
      <template #modal-cancel>
        <!-- add a X icon to the cancel button-->
        <b-icon-x-square-fill /> Cancel
      </template>

      <template #modal-ok>
        <!-- change the OK button to say Delete instead and add a trash can icon-->
        <b-icon-trash-fill /> Delete
      </template>
      Are you sure you want to delete {{tempStudent.familyName}}, {{tempStudent.givenName}}?
    </b-modal>

    <!-- ERROR MESSAGE -->
    <!--    only show this alert when there is an violationMessage attribute in the data variable object 'violation'    -->
    <b-alert variant="danger" :show="violation.violationMessage">
      {{violation.violationMessage}}
    </b-alert>
    <!--    ONLY SHOW debug info (very ugly) if the debug prop is set to true-->
    <b-alert variant="secondary" dismissible :show="debug">
      <pre>
PROPS:
{{$props}}

DATA:
{{$data}}
        </pre>
    </b-alert>
  </div>
</template>

<script lang="ts">
/* eslint-disable max-len */
import {
  Component, Mixins, Prop, Watch,
} from 'vue-property-decorator';
import Student from '@/models/Student';
import { BIcon } from 'bootstrap-vue';
import GlobalMixin from '@/mixins/global-mixin';

@Component
export default class StudentForm extends Mixins(GlobalMixin) {
  @Prop({ type: Object, validator: (s) => s instanceof Object }) readonly student: any

  $refs!: {
    iconDelete: BIcon
    iconSave : BIcon
  }

  // region DATA VARIABLES
  // will store a copy of the values from the student declared in the props section
  tempStudent: Student = new Student()

  violation: any = {} // will store violation messages that we get from the api

  dt = {
    // Display Text - object that stores text to display to the user instead of the attribute names
    fN: 'Family Name',
    gN: 'Given Name',
    em: 'Email Address',
    sA: 'Street Address',
    pn: 'Phone Number',
  }

  showConfirmDelete = false
  // endregion

  // region METHODS
  saveStudent() {
    const icon:BIcon = this.$refs.iconSave; // get the icon to animate from the vue refs https://vuejs.org/v2/api/#ref
    this.setBusy(true);// tell parent that this component is waiting for the api to respond
    this.animate(icon, true);// animate the icon in the clicked button to give the user an indication that some thing is happening
    this.violation = {};// empty out violation messages - to hide violation message from user and wait for new violations from the api

    // use the method declared in the student mixin to call the student api
    // if the student is new POST , if the student already exists then PUT
    const url = this.STUDENT_API + (this.isNew ? '' : `/${this.tempStudent.id}`);
    const method = this.isNew ? 'post' : 'put';

    this.callAPI(url, method, this.tempStudent) // returns a promise object
      .then((data) => {
        // determine if the student was added or updated
        this.$emit(this.tempStudent.id === data.id ? 'updated' : 'added', data);
      })
      .catch((err) => {
        // get the violation messages from the api - if the web server responded
        this.violation = err.data || {};
      })
      .finally(() => {
        this.setBusy(false);// tell parent that this component is no longer waiting for the api
        this.animate(icon, false);// stop the icon animation
      });
  }

  cancel() {
    this.violation = {}; // clear out violation messages and as a result the hasErrs will be null
    this.tempStudent = { ...this.student };// copy the student values to a new temp student
    this.$emit('cancelled', this.student); // tell parent that cancel was called
  }

  deleteStudent() {
    const icon:BIcon = this.$refs.iconDelete; // get the icon to animate from the vue refs https://vuejs.org/v2/api/#ref
    this.setBusy(true);// tell parent that this component is waiting for the api
    this.animate(icon, true);// animate the icon the clicked button
    this.violation = {};// empty out violation messages
    this.callAPI(`${this.STUDENT_API}/${this.tempStudent.id}`, 'delete')
      .then((res) => {
        this.tempStudent = new Student();
        this.$emit('deleted', this.student);// tell parent student was deleted
      })
      .catch(() => {
        this.$emit('reset', this.student);
      })
      .finally(() => {
        this.setBusy(false);// tell parent that this component is no longer waiting for the api
        this.animate(icon, false);// stop the icon animation
      });
  }

  deleteConfirm() {
    this.cancel(); // reset values - in case user edited before attempting to delete
    this.showConfirmDelete = true; // show the modal confirm message
    // IMPORTANT- the b-modal built-in "ok" "and "cancel" buttons automatically close/hide the modal
    // closing the modal automatically updates the showConfirmDelete
  }

  animate(icon:BIcon, start:boolean) {
    if (start) {
      // apply animation style to the icon
      icon.classList.add('b-icon-animation-cylon-vertical');
    } else {
      // remove animation style from the icon
      icon.classList.remove('b-icon-animation-cylon-vertical');
    }
  }

  // endregion

  // region COMPUTED PROPERTIES
  get hasErr(): any {
    return { // bootstrap hasErrs used to display violation messages
      // true - green border, false - red border, null- regular border
      fN: this.violation.familyName ? false : null,
      gN: this.violation.givenName ? false : null,
      em: this.violation.email ? false : null,
      sA: this.violation.address ? false : null,
      pn: this.violation.phone ? false : null,
    };
  }

  get isNew(): boolean {
    // if studentID is null, 0 , '' then it's a new student not an existing student
    return !this.student || !this.student.id;
  }

  // endregion

  // region WATCHES execute code when a data variable or prop is modified by processes in the application
  @Watch('student', { deep: true })// watch all attributes of the student object - if any attribute changes then execute the handler
  onStudentChanged(newStu: Student, oldStu: Student) { // execute this function when the student object in the props section changes
    if (!newStu || !newStu.id) {
      // if new student is null or doesn't have an id
      this.tempStudent = new Student();// clear out temporary student
    } else if (!oldStu || newStu.id !== oldStu.id) {
      // if old student is null or new student is not the same as old student
      // COPY VALUES from the student prop into new a temp student object
      this.tempStudent = Object.assign(new Student(), this.student);
    }
    this.violation = {};// empty out violation messages - to hide them from the user
  }
}
</script>

<style scoped>

</style>
