<template>
  <div class="savedInvoices" :class="{'s-visible': showingSidebar}">
    <h4>Saved Invoices</h4>
    <ul class="invoices" v-if="invoices.length > 0">
      <li
        class="invoice"
        v-for="(invoice,i) in invoices"
        :key="i"
        @click="loadInvoice(invoice.id)"
        :class="{'s-active':invoice.id === activeInvoice}"
      >{{invoice.name}}</li>
    </ul>
    <span class="t-placeholder" v-else>You haven't saved any invoices yet. Get cracking!</span>
    <button @click="createNewInvoice">+ New</button>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    showingSidebar: Boolean
  },
  computed: {
    invoices() {
      return this.$store.getters["invoices"];
    },
    activeInvoice() {
      return this.$store.getters["activeInvoice"];
    }
  },
  methods: {
    loadInvoice(invoiceId) {
      this.$store.dispatch("loadInvoice", invoiceId);
    },
    createNewInvoice() {
      this.$store.dispatch("createNewInvoice");
    }
  }
};
</script>

<style lang="scss">
.savedInvoices {
  width: 200px;
  margin-top: 60px;
  padding: 16px;
  transform: translateX(-100%) scale(0.8);
  transition: transform 0.3s ease-in-out;

  &.s-visible {
    transform: translateX(0) scale(1);
  }

  //Show the menu always on big screens
  @include breakpoint(l) {
    margin-top: 0;
    transform: none !important;
  }
}

.invoices {
  margin: 16px 0;
}

.invoice {
  margin: 0 -16px;
  padding: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba($blue, 0.2);
  }

  &.s-active {
    background-color: $blue;
    color: white;
  }
}
</style>

