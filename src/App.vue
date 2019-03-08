<template>
  <div id="app">
    <div class="page">
    <header class="invoice-header">
      <div>
        <h1 contenteditable="true" @focus="selectAll($event)" class="editableValue">Company Name</h1>
        <h4>Invoice</h4>
      </div>
      <div>
        <h5 class="t-right editableValue" contenteditable="true" @focus="selectAll($event)">{{ date }}</h5>
      </div>
      <Contact :label="'From'" /> <Contact :label="'To'" />
    </header>

    <h2 contenteditable="true" @focus="selectAll($event)" class="editableValue">Project Name</h2>
    <div class="stats">
      <div class="stat">
        ${{ formatMoney(subTotal) }} <label>Subtotal</label>
      </div> 
      <div class="stat">+</div>
      <div class="stat">
        ${{ formatMoney(totalFees) }} <label>Total Fees</label>
      </div>
      <div class="stat">=</div>
      <div class="stat">
        ${{ formatMoney(invoiceTotal) }} <label>Total Cost</label>
      </div>
    </div>

    <Tasks @updatedSubTotal="updateSubtotal" @updatedHours="updateHours" />

    <Fees :subTotal="subTotal" @updatedFees="updateFees" />

    <div class="summary-row">
      <div></div>
      <div class="t-right">
        <hr />
        <h2>Total Cost = ${{ formatMoney(invoiceTotal) }}</h2>
      </div>
    </div>
    </div>
    <footer>
      <div class="footer-actions">
        <span>Keeping it simple. Print this to a PDF or give it to the client face to face, old fashion stylez.</span>
        <button @click="print">Print</button>
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

export default {
  name: "App",
  components: {
    Contact,
    Fees,
    Tasks
  },
  mixins: [selectAll],
  computed: {
    invoiceTotal() {
      return this.subTotal + this.totalFees;
    }
  },
  methods: {
    formatMoney,
    updateHours(value) {
      this.totalHours = value;
    },
    updateSubtotal(value) {
      this.subTotal = value;
    },
    updateFees(value) {
      this.totalFees = value;
    },
    print(){
      window.print();
    }
  },
  data() {
    return {
      date: dayjs().format("D MMMM YYYY"),
      hourlyRate: 80,
      totalFees: 0,
      totalHours: 0,
      subTotal: 0,
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
#app {
  font-family: "Space Mono", monospace;
  text-align: left;
  color: black;
}

.page{
  max-width: 1000px;
  margin: 40px auto 160px;
  padding: 40px;
  background: #ffffff;
  box-shadow: 0 24px 30px 0 rgba(74, 144, 226, 0.25),
    0 24px 30px 0 rgba(0, 0, 0, 0.5);
}

footer{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: lightgrey;
  padding: 16px;

  .footer-actions{
    display: grid;
    grid-template-columns: 1fr auto;
    max-width: 1000px;
    margin: 0 auto;
  }
}

h1, h2, h3,
h4,h5,h6 {
  margin-top: 0px;
  margin-bottom: 0px;
}

$blue: #0619ff;

.t-right {
  text-align: right;
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

  &:focus{
    --bscolor: currentColor;
    box-shadow: 2px 2px 2px var(--bscolor);
  }
}

input {
  border: none;

  &:focus {
    background-color: rgba($blue, 0.2);
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

  &:hover{
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

  .page{
    box-shadow: none;
    padding: 0;
  }
  
  footer{
    display: none;
  }
}
</style>
