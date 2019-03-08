<template>
  <div id="app">
    <div class="body">
      <div class="savedInvoices" v-if="invoices.length > 0">
        <h4>Saved Invoices</h4>
        <ul class="invoices">
          <li
            class="invoice"
            v-for="(invoice,i) in invoices"
            :key="i"
            @click="loadInvoice(invoice.id)"
            :class="{'s-active':invoice.id === activeInvoice}"
          >{{invoice.name}}</li>
        </ul>
        <button @click="createNewInvoice">+ New</button>
      </div>
      <div class="page" :class="{'s-loading': isAddingNewInvoice }">
        <header class="invoice-header">
          <div>
            <h1 contenteditable="true" @focus="selectAll($event)" class="editableValue">Company Name</h1>
            <h4>
              Invoice
              <span
                class="editableValue"
                contenteditable="true"
                @focus="selectAll($event)"
              >12345</span>
            </h4>
          </div>
          <div>
            <h5
              class="t-right editableValue"
              contenteditable="true"
              @focus="selectAll($event)"
            >{{ date }}</h5>
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
          <div class="stat">=</div>
          <div class="stat">
            ${{ formatMoney(invoiceTotal) }}
            <label>Total Cost</label>
          </div>
        </div>

        <Tasks/>

        <Fees :subTotal="subTotal" @updatedFees="updateFees"/>

        <div class="summary-row">
          <div></div>
          <div class="t-right">
            <hr>
            <h2>Total Cost = ${{ formatMoney(invoiceTotal) }}</h2>
          </div>
        </div>
      </div>
    </div>
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
        <span>Keeping it simple. Print this to a PDF or give it to the client face to face, old fashion stylez.</span>
        <div>
          <button @click="print">Print</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Contact from "./components/Contact";
import Fees from "./components/Fees";
import Tasks from "./components/Tasks";
import dayjs from "dayjs";
import { formatMoney } from "./lib/helpers";
import { selectAll } from "./lib/mixins";
import { setTimeout } from "timers";

export default {
  name: "App",
  components: {
    Contact,
    Fees,
    Tasks
  },
  mixins: [selectAll],
  mounted: function() {
    this.$store.dispatch("loadAllInvoices");
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
    invoices() {
      return this.$store.getters["invoices"];
    },
    activeInvoice() {
      return this.$store.getters["activeInvoice"];
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
    loadInvoice(invoiceId) {
      this.isAddingNewInvoice = true;
      setTimeout(() => {
        this.$store.dispatch("loadInvoice", invoiceId);
        this.isAddingNewInvoice = false;
      }, 500);
    },
    createNewInvoice() {
      this.isAddingNewInvoice = true;
      setTimeout(() => {
        this.$store.dispatch("createNewInvoice");
        this.isAddingNewInvoice = false;
      }, 500);
    },
    updateInvoice() {
      this.$store.dispatch("updateInvoice");
    }
  },
  data() {
    return {
      date: dayjs().format("D MMMM YYYY"),
      invoiceName: "",
      isAddingNewInvoice: false,
      savingInvoice: false,
      wzrdz: {
        name: "My Name",
        email: "myemail@email.com"
      },
      client: {
        name: "",
        email: ""
      }
    };
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Space+Mono:400,700");

$blue: #0619ff;

#app {
  font-family: "Space Mono", monospace;
  text-align: left;
  color: black;
}

.body {
  display: grid;
  grid-template-columns: auto 1fr;
  overflow-x: hidden;
}

.savedInvoices {
  width: 200px;
}

.invoices {
  margin-bottom: 16px;
}

.invoice {
  &.s-active {
    color: $blue;
  }
}

.page {
  grid-column: 2 / 3;
  max-width: 1000px;
  margin: 40px auto 160px;
  padding: 40px;
  background: #ffffff;
  box-shadow: 0 24px 30px 0 rgba(74, 144, 226, 0.25),
    0 24px 30px 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.5s ease-in-out;

  &.s-loading {
    transform: translate(200%, 10%);
  }
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: lightgrey;
  padding: 16px;

  .footer-actions {
    display: grid;
    grid-template-columns: auto 1fr auto;
    max-width: 1000px;
    margin: 0 auto;
    grid-gap: 16px;
  }
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0px;
  margin-bottom: 0px;
}

.t-right {
  text-align: right;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

button,
input,
select {
  font-family: "Space Mono";
  font-size: 1rem;
  font-weight: 700;
  appearance: none;
  outline: none;
}

button {
  border: 2px solid $blue;
  padding: 4px 16px;
  color: $blue;
  cursor: pointer;

  &.negative {
    color: red;
    border-color: red;
    &:hover {
      background-color: red;
    }
  }

  &.positive {
    color: green;
    border-color: green;

    &:hover {
      background-color: green;
    }
  }

  &.minimal {
    border-color: transparent;
  }

  &:hover {
    background-color: $blue;
    color: white;
  }

  &:focus {
    --bscolor: currentColor;
    box-shadow: 2px 2px 2px var(--bscolor);
  }
}

input {
  border: none;

  &:focus {
    background-color: rgba($blue, 0.2);
  }

  &.oulined {
    border: 2px solid black;
    padding: 8px;
  }
}

::selection {
  background: $blue;
  color: white;
}

select {
  border: none;
  border-radius: 0;
  -webkit-appearance: none;
  -webkit-border-radius: 0px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23000000'><polygon points='0,0 100,0 50,50'/></svg>")
    no-repeat;
  background-size: 12px;
  background-position: calc(100% - 10px) calc(50% + 3px);
  background-repeat: no-repeat;

  &:focus {
    background-color: rgba($blue, 0.2);
  }
}

.hidden {
  visibility: hidden;
}

.editableValue {
  margin-bottom: 4px;
  outline: none;
  padding: 4px;

  &:hover {
    background-color: lightgrey;
  }

  &:focus {
    background-color: rgba($blue, 0.2);
  }
}

hr {
  background-color: transparent;
  border-bottom: 2px solid black;
}

.invoice-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-gap: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid lightgrey;
}

.stats {
  display: flex;
  margin: 24px 0;
  border: 2px solid black;
  padding: 24px;

  & > * {
    flex: 1 1 0;
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
}

.task-header {
  & span {
    display: inline-block;
    background-color: black;
    -webkit-print-color-adjust: exact;
    padding: 8px;
    color: white;
  }
}

.summary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 16px;
  font-weight: 700;
}

.task-header,
.task {
  display: grid;
  grid-template-columns: 1fr 20% 20% auto;
}

.fee-inputs {
  display: grid;
  grid-template-columns: 1fr 20% 20%;
}

.fee-inputs > * {
  padding: 16px;
}

.itemrow {
  border: 2px solid black;
  border-bottom-width: 0;

  & > * {
    padding: 16px;
  }

  .hours,
  .fee,
  .rate,
  .remove,
  .type {
    border-left: 2px solid black;
    text-align: right;
  }

  &:last-child {
    border-bottom-width: 2px;
  }
}

@media print {
  button {
    display: none;
  }

  @page {
    size: auto;
    margin: 0mm;
  }

  #app {
    margin: 4mm 12mm;
  }

  .page {
    box-shadow: none;
    padding: 0;
  }

  footer {
    display: none;
  }
}
</style>
