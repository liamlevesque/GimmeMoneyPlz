<template>
  <div class="contact">
    <label>{{ label ? label : "" }}</label>
    <div>
      <div
        class="editableValue"
        contenteditable="true"
        @focus="selectAll($event);"
      >
        Name
      </div>
      <div
        class="editableValue"
        contenteditable="true"
        @focus="selectAll($event);"
      >
        E-mail Address
      </div>
    </div>
  </div>
</template>

<script>
import { selectAll } from "../lib/mixins";

export default {
  name: "Contact",
  props: {
    label: String,
    info: Object
  },
  mixins: [selectAll]
};
</script>

<style lang="scss">
.contact {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 16px;
}

label {
  color: grey;
}
</style>
