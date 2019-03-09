<template>
  <div id="app">
    <div class="sidebar">
      <Sidebar :showingSidebar="showingSidebar"/>
    </div>

    <div class="page-scroll" :class="{'s-sidebar': showingSidebar}">
      <div class="page" :class="{'s-loading': isAddingNewInvoice}">
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

        <div
          class="payment-instructions"
          contenteditable="true"
          @focus="selectAll($event)"
        >Payment is due within 30 days of receiving this invoice.
          <br>Payment can be sent via interac money transfer to the e-mail address above.
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
            <span></span>
            <!-- <span>Keeping it simple. Print this to a PDF or give it to the client face to face, old fashion stylez.</span> -->
            <div>
              <button @click="print">Print</button>
            </div>
          </div>
        </footer>
      </div>
      <div class="sidebar-open-click-overlay" @click="toggleSidebar" v-if="showingSidebar"></div>
      <button class="menu-button" @click="toggleSidebar">{{ showingSidebar ? 'Hide' : 'Show' }} Menu</button>
    </div>
  </div>
</template>

<script>
import Contact from "./components/Contact";
import Fees from "./components/Fees";
import Tasks from "./components/Tasks";
import Sidebar from "./components/Sidebar";
import dayjs from "dayjs";
import { formatMoney } from "./lib/helpers";
import { selectAll } from "./lib/mixins";
import { setTimeout } from "timers";

export default {
  name: "App",
  components: {
    Contact,
    Fees,
    Tasks,
    Sidebar
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
    updateInvoice() {
      this.$store.dispatch("updateInvoice");
    },
    toggleSidebar() {
      this.showingSidebar = !this.showingSidebar;
    }
  },
  data() {
    return {
      date: dayjs().format("D MMMM YYYY"),
      invoiceName: "",
      isAddingNewInvoice: false,
      savingInvoice: false,
      showingSidebar: false,
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
@import "./scss/global";
@import url("https://fonts.googleapis.com/css?family=Space+Mono:400,700");

#app {
  font-family: "Space Mono", monospace;
  text-align: left;
  color: black;
  width: 100vw;
  min-width: 0;
  height: 100vh;
  display: grid;
  grid-template-columns: auto 1fr;
  overflow: hidden;
}

.menu-button {
  position: fixed;
  top: 16px;
  left: 16px;

  @include breakpoint(l) {
    display: none;
  }
}

.sidebar {
  width: 0;
  overflow: visible;

  @include breakpoint(l) {
    width: auto;
  }
}

.sidebar-open-click-overlay {
  position: fixed;
  top: 0;
  left: 200px;
  width: calc(100% - 200px);
  height: 100%;
  background-color: rgba(white, 0.4);
  cursor: pointer;

  @include breakpoint(l) {
    display: none;
  }
}

.page-scroll {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 20px 20px 0;
  transition: transform 0.2s ease-in-out;

  &.s-sidebar .page {
    transform: translateX(200px) scale(0.9);
    opacity: 0.5;
    pointer-events: none;
  }
}

.page {
  grid-column: 2 / 3;
  max-width: 1000px;
  min-width: 0;
  width: 100%;
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

.payment-instructions {
  margin-bottom: 16px;
}

footer {
  background-color: lightgrey;
  padding: 16px;
  margin: 0 -40px -40px -40px;
  position: sticky;
  bottom: 0;

  .footer-actions {
    display: grid;
    grid-template-columns: auto 1fr auto;
    max-width: 1000px;
    margin: 0 auto;
    grid-gap: 16px;
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

  footer,
  .savedInvoices {
    display: none;
  }
}
</style>
