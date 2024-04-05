<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';

@Component
export default class ErrorMessage extends Vue {
  @Prop() readonly message!: string;

  private get modal(): BModal {
    return this.$refs.errorModal as BModal;
  }

  show() {
    this.modal.show();
  }
}
</script>
