<template>
  <div>
    <div class="tasks" v-if="fees.length > 0">
      <div class="task-header">
        <div>
          <span class="name">Fee</span>
        </div>
        <div>
          <span class="hours">Cost</span>
        </div>
        <div>
          <span class="name">Fee Type</span>
        </div>
        <div>
          <button class="negative minimal remove hidden">remove</button>
        </div>
      </div>
      <div v-for="fee in fees" :key="fee.id" class="itemrow task">
        <input
          type="text"
          class="name"
          v-model="fee.name"
          @focus="selectAllInput($event);"
          :ref="fee.id"
        >
        <!-- <select class="type" type="number" v-model="fee.type">
          <option
            v-for="(feetype, i) in feetypes"
            :key="i"
            :value="feetype.type"
            >{{ feetype.name }}</option
          >
        </select>-->
        <input type="number" class="hours" v-model="fee.amount">
        <div class="type">
          <label class="radio-input">
            <input type="radio" value="percent" v-model="fee.type">
            <span>%</span>
          </label>
          <label class="radio-input">
            <input type="radio" value="fixed" v-model="fee.type">
            <span>$</span>
          </label>
        </div>
        <button class="negative minimal remove" @click="removeFee(fee.id);">remove</button>
      </div>
    </div>
    <div class="summary-row">
      <div>
        <button @click="addFee">Add Fee</button>
      </div>
      <div v-if="fees.length > 0">
        <div class="t-right">Total Fees = ${{ formatMoney(totalFees) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatMoney } from "../lib/helpers";
import { selectAll } from "../lib/mixins";

export default {
  name: "Fees",
  mixins: [selectAll],
  props: {
    subTotal: Number
  },
  data() {
    return {
      feetypes: [
        {
          type: "percent",
          name: "Percentage"
        },
        {
          type: "fixed",
          name: "Fixed Price"
        }
      ]
    };
  },
  computed: {
    fees() {
      return this.$store.getters["fees"];
    },
    totalFees() {
      return this.$store.getters["totalFees"];
    }
  },
  methods: {
    formatMoney,
    addFee() {
      let newFee = {
        id: new Date().getTime(),
        name: "Fee Name",
        amount: 0,
        type: "percent"
      };
      this.$store.dispatch("addFee", newFee);
      this.$nextTick(function() {
        this.$refs[newFee.id][0].focus();
      });
    },
    removeFee(id) {
      this.$store.dispatch("removeFee", id);
    }
  }
};
</script>

<style lang="scss">
.type {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.radio-input {
  font-size: 1.5rem;
  color: black;
  cursor: pointer;
  position: relative;

  span {
    display: block;
    text-align: center;
    user-select: none;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  input:active + span,
  input:focus + span,
  input:hover + span {
    background-color: rgba($blue, 0.2);
  }

  input:checked + span {
    background-color: $blue;
    color: white;
  }
}
</style>
