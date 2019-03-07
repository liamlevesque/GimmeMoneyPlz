<template>
  <div>
    <div class="tasks" v-if="tasks.length > 0">
      <div class="task task-header">
        <div><span class="name">Task</span></div>
        <div><span class="rate">Hourly Rate</span></div>
        <div><span class="hours">Hours</span></div>
        <div>
          <button class="negative minimal remove hidden">remove</button>
        </div>
      </div>
      <div v-for="task in tasks" :key="task.id" class="itemrow task">
        <input
          type="text"
          class="name"
          v-model="task.name"
          @focus="selectAllInput($event);"
          :ref="task.id"
        />
        <input
          type="number"
          class="rate"
          v-model="task.rate"
          @focus="selectAllInput($event);"
        />
        <input
          type="number"
          class="hours"
          v-model="task.hours"
          @focus="selectAllInput($event);"
        />
        <button class="negative minimal remove" @click="removeTask(task.id);">
          remove
        </button>
      </div>
    </div>
    <div class="summary-row">
      <div><button @click="addTask">Add Task</button></div>
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
    return {
      tasks: [
        {
          id: new Date().getTime(),
          name: "Task Name",
          rate: 0,
          hours: 0
        }
      ]
    };
  },
  computed: {
    totalHours() {
      return this.tasks.reduce(
        (total, current) => (total += parseInt(current.hours, 10)),
        0
      );
    },
    subTotal() {
      return this.tasks.reduce(
        (total, current) =>
          (total += parseInt(current.hours, 10) * parseInt(current.rate, 10)),
        0
      );
    }
  },
  watch: {
    totalHours: function(update) {
      this.$emit("updatedHours", update);
    },
    subTotal: function(update) {
      this.$emit("updatedSubTotal", update);
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
      this.tasks.push(newTask);
      this.$nextTick(function() {
        this.$refs[newTask.id][0].focus();
      });
    },
    removeTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    }
  }
};
</script>

<style></style>
