<template>
  <div>
    <div class="tasks" v-if="tasks.length > 0">
      <div class="task task-header">
        <div>
          <span class="name">Task</span>
        </div>
        <div>
          <span class="rate">Hourly Rate</span>
        </div>
        <div>
          <span class="hours">Hours</span>
        </div>
        <div>
          <button class="negative minimal remove hidden">remove</button>
        </div>
      </div>
      <div v-for="task in tasks" :key="task.id" class="itemrow task">
        <div class="name">
          <input type="text" v-model="task.name" @focus="selectAllInput($event);" :ref="task.id">
        </div>
        <div class="rate">
          <input type="number" v-model="task.rate" @focus="selectAllInput($event);">
        </div>
        <div class="hours">
          <input type="number" v-model="task.hours" @focus="selectAllInput($event);">
        </div>
        <div class="remove">
          <button class="negative minimal" @click="removeTask(task.id);">remove</button>
        </div>
      </div>
    </div>
    <div class="summary-row">
      <div>
        <button @click="addTask">Add Task</button>
      </div>
      <div>
        <div class="t-right">Total Hours = {{ totalHours }}</div>
        <div class="t-right">Subtotal = ${{ formatMoney(subTotal) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatMoney } from "../lib/helpers";
import { selectAll } from "../lib/mixins";

export default {
  name: "Tasks",
  mixins: [selectAll],
  data() {
    return {};
  },
  computed: {
    tasks() {
      return this.$store.getters["tasks"];
    },
    totalHours() {
      return this.$store.getters["totalHours"];
    },
    subTotal() {
      return this.$store.getters["subTotal"];
    }
  },
  methods: {
    formatMoney,
    addTask() {
      let newTask = {
        id: new Date().getTime(),
        name: "Task Name",
        rate: 0,
        hours: 0
      };
      this.$store.dispatch("addTask", newTask);
      this.$nextTick(function() {
        this.$refs[newTask.id][0].focus();
      });
    },
    removeTask(id) {
      this.$store.dispatch("removeTask", id);
    }
  }
};
</script>

<style lang="scss">
@include breakpoint(m-max) {
  .name,
  .rate,
  .hours {
    display: grid;
    grid-template-columns: auto 1fr;

    &:before {
      background-color: black;
      color: white;
      padding: 16px;
    }
  }
  .name:before {
    content: "Task";
  }
  .rate:before {
    content: "$/Hr";
  }
  .hours:before {
    content: "Hrs";
  }
}
</style>
