<template>
  <div>
    <transition name="addline">
      <div class="fees" v-if="fees.length > 0">
        <div class="fee-header">
          <div>
            <span class="name">Fee</span>
          </div>
          <div>
            <span class="cost">Cost</span>
          </div>
          <div>
            <span class="name">Fee Type</span>
          </div>
          <div>
            <button class="negative minimal remove hidden">remove</button>
          </div>
        </div>
        <transition-group tag="div" name="addline">
          <div v-for="fee in fees" :key="fee.id" class="fee">
            <div class="name">
              <input
                type="text"
                v-model="fee.name"
                @focus="selectAllInput($event);"
                :ref="fee.id"
                placeholder="Describe the fee"
              >
            </div>
            <div class="cost">
              <input type="number" v-model="fee.amount" placeholder="$ or %">
            </div>
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
            <div class="remove">
              <button class="negative minimal" @click="removeFee(fee.id);">remove</button>
            </div>
          </div>
        </transition-group>
      </div>
    </transition>
    <div class="summary-row">
      <div>
        <button @click="addFee">Add Fee</button>
      </div>
      <div v-if="fees.length > 0">
        <div class="t-right">Total Fees = ${{ formatMoney(totalFees) }}</div>
      </div>
      <div
        class="t-placeholder"
        v-else
      >Fees are things like taxes or charges that aren't part of your work</div>
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
        name: null,
        amount: null,
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

<style lang="scss" scoped>
.fee {
  @include itemrow;
}

.fee-header {
  @include rowHeader;
}

@include breakpoint(m-max) {
  .name,
  .cost {
    display: grid;
    grid-template-columns: auto 1fr;

    &:before {
      background-color: black;
      color: white;
      padding: 16px;
    }
  }
  .name:before {
    content: "Fee";
  }
  .cost:before {
    content: "Cost";
  }
}

.type {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.radio-input {
  font-size: 1.5rem;
  color: black;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: stretch;
  padding: 8px;

  span {
    display: block;
    text-align: center;
    user-select: none;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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
