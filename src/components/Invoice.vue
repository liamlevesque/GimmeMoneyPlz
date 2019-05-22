<template>
  <main class="page">
    <header class="invoice-header">
      <div>
        <input
          type="text"
          @focus="selectAllInput($event)"
          class="w-100 t-large"
          placeholder="Company Name"
          v-model="metadata.companyName"
        >
        <h4>
          Invoice
          <input
            type="text"
            @focus="selectAllInput($event)"
            placeholder="######"
            v-model="metadata.invoiceNumber"
          >
        </h4>
      </div>
      <div class="t-right">
        <input
          type="text"
          @focus="selectAllInput($event)"
          v-model="metadata.date"
          class="t-right t-small"
        >
      </div>
      <Contact :label="'From'"/>
      <Contact :label="'To'"/>
    </header>

    <h2 contenteditable="true" @focus="selectAll($event)" class="editableValue">Project Name</h2>
    <div class="stats">
      <div class="stat">
        ${{ formatMoney(subTotal) }}
        <label>Subtotal</label>
      </div>
      <div class="stat">+</div>
      <div class="stat">
        ${{ formatMoney(totalFees) }}
        <label>Total Fees</label>
      </div>
      <div class="stat stat-equals">=</div>
      <div class="stat stat-total">
        ${{ formatMoney(invoiceTotal) }}
        <label>Total Cost</label>
      </div>
    </div>

    <Tasks/>

    <Fees :subTotal="subTotal" @updatedFees="updateFees"/>

    <div class="invoice-total-row">
      <div></div>
      <div class="t-right">
        <hr>
        <h2>Total Cost = ${{ formatMoney(invoiceTotal) }}</h2>
      </div>
    </div>

    <textarea
      class="payment-instructions t-small"
      @focus="selectAllInput($event)"
      v-model="metadata.paymentTerms"
    />
    <footer>
      <div class="footer-actions">
        <button class="positive" v-if="activeInvoice" @click="updateInvoice">Save Changes</button>
        <button
          class="positive"
          @click="toggleSaveInvoice"
          v-if="!savingInvoice && !activeInvoice"
        >Save for later</button>
        <div class="saving" v-if="savingInvoice">
          <input
            type="text"
            v-model="invoiceName"
            class="oulined"
            placeholder="Name for the invoice"
          >
          <button class="positive" @click="saveInvoice">Save</button>
        </div>
        <span></span>
        <!-- <span>Keeping it simple. Print this to a PDF or give it to the client face to face, old fashion stylez.</span> -->
        <div>
          <button @click="print">Print</button>
        </div>
      </div>
    </footer>
  </main>
</template>

<script>
import Contact from "./Contact";
import Fees from "./Fees";
import Tasks from "./Tasks";
import { formatMoney } from "../lib/helpers";
import { selectAll } from "../lib/mixins";

import dayjs from "dayjs";

export default {
  name: "Invoice",
  components: {
    Contact,
    Fees,
    Tasks
  },
  mixins: [selectAll],
  props: {
    activeInvoice: Number
  },
  computed: {
    totalHours() {
      return this.$store.getters["totalHours"];
    },
    subTotal() {
      return this.$store.getters["subTotal"];
    },
    totalFees() {
      return this.$store.getters["totalFees"];
    },
    invoiceTotal() {
      return this.subTotal + this.totalFees;
    },
    metadata() {
      return this.$store.getters["metadata"];
    }
  },
  methods: {
    formatMoney,
    updateFees(value) {
      this.totalFees = value;
    },
    print() {
      window.print();
    },
    toggleSaveInvoice() {
      this.savingInvoice = !this.savingInvoice;
    },
    saveInvoice() {
      this.$store.dispatch("saveInvoice", this.invoiceName);
      this.savingInvoice = false;
    },
    updateInvoice() {
      this.$store.dispatch("updateInvoice");
    }
  },
  data() {
    return {
      date: dayjs().format("D MMMM YYYY"),
      invoiceName: "",
      savingInvoice: false
    };
  }
};
</script>

<style lang="scss">
.page {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  max-width: 1000px;
  min-width: 0;
  width: 100%;
  margin: 40px auto 160px;
  padding: 40px 16px;
  background: #ffffff;
  box-shadow: 0 10px 30px 0 rgba(74, 144, 226, 0.25),
    0 20px 30px 0 rgba(0, 0, 0, 0.5);
  will-change: transform, opacity;

  @include breakpoint(m) {
    padding: 40px;
  }

  &.swingin-enter-active {
    animation: slide-in 0.7s ease-in-out;
  }
  &.swingin-leave-active {
    animation: slide-out 0.5s ease-in-out;
  }
  /* 
  &.swingin-enter-active,
  &.swingin-leave-active {
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  } */
}

@keyframes slide-in {
  0% {
    transform: translate3d(100%, 0, 0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translate3d(100%, 0, 0) scale(1);
    opacity: 0;
  }
  80% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}

@keyframes slide-out {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
  70% {
    transform: translate3d(0, 0, 0) scale(0.9);
    opacity: 1;
  }
  100% {
    transform: translate3d(-100%, 0, 0) scale(1);
    opacity: 0;
  }
}

.invoice-header {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto auto auto;
  grid-gap: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid lightgrey;

  @include breakpoint(m) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
  }
}

///////////////// METADATA /////////////////
.input--company {
  font-size: 2rem;
}

.stats {
  margin: 24px 0;
  border: 2px solid black;
  padding: 16px 0 0;
  display: grid;
  grid-template-columns: 1fr 30px 1fr;
  grid-template-rows: auto auto;
  grid-gap: 16px;

  @include breakpoint(m) {
    grid-template-columns: 1fr 30px 1fr 30px 1fr;
    grid-template-rows: auto;
    padding: 24px;
  }
}

.stat {
  font-size: 1.3rem;
  text-align: center;
  font-weight: 700;

  label {
    font-size: 1rem;
    font-weight: 400;
    display: block;
  }

  &.stat-equals {
    @include breakpoint(m-max) {
      display: none;
    }
  }

  &.stat-total {
    @include breakpoint(m-max) {
      padding: 8px 0;
      background-color: black;
      color: white;
      grid-column: 1 / 4;
    }
  }
}

.summary-row,
.invoice-total-row {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 16px;
  padding: 16px 16px 16px 0;
  font-weight: 700;
}

.invoice-total-row {
  grid-template-columns: 1fr;

  @include breakpoint(m) {
    grid-template-columns: 1fr auto;
  }
}

.payment-instructions {
  margin-bottom: 16px;
}

footer {
  background-color: lightgrey;
  padding: 16px;
  position: sticky;
  bottom: 0;
  margin: 0 -16px -40px;

  @include breakpoint(m) {
    margin: 0 -40px -40px -40px;
  }

  .footer-actions {
    display: grid;
    grid-template-columns: auto 1fr auto;
    max-width: 1000px;
    margin: 0 auto;
    grid-gap: 16px;
  }
}
</style>

