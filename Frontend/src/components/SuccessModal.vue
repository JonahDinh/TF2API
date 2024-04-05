<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';

@Component
export default class SuccessMessage extends Vue {
  @Prop() readonly message!: string;

  private get modal(): BModal {
    return this.$refs.successModal as BModal;
  }

  show() {
    this.modal.show();
  }
}
</script>
