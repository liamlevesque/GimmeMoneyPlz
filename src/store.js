import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fees: [],
    tasks: [
      {
        id: new Date().getTime(),
        name: "Task Name",
        rate: 0,
        hours: 0
      }
    ],
    subTotal: 0,
    totalFees: 0,
    invoiceTotal: 0,
  },
  getters: {
    fees: state => {
      return state.fees;
    },
    tasks: state => {
      return state.tasks;
    },
    totalHours: state => {
      return state.tasks.reduce(
        (total, current) => (total += parseInt(current.hours, 10)),
        0
      );
    },
    subTotal: state => {
      return state.tasks.reduce(
        (total, current) =>
          (total += parseInt(current.hours, 10) * parseInt(current.rate, 10)),
        0
      );
    },
    totalFees: (state,getters) => {
      return state.fees.reduce((total, current) => {
        if (current.type === "percent"){
          console.log('subtotal"'+ getters.subTotal);
          return (total += (parseFloat(current.amount) / 100) * getters.subTotal);
        }
        else return (total += parseInt(current.amount, 10));
      }, 0);
    }
  },
  mutations: {
    addTask(state, task){
      state.tasks.push(task);
    },
    removeTask(state, taskid){
      state.tasks = state.tasks.filter(task => task.id !== taskid);
    },
    addFee(state, fee){
      state.fees.push(fee);
    },
    removeFee(state, feeid){
      state.fees = state.fees.filter(fee => fee.id !== feeid);
    }
  },
  actions: {
    addTask(context,task){
      context.commit('addTask',task);
    },
    removeTask(context,taskid){
      context.commit('removeTask',taskid);
    },
    addFee(context,fee){
      context.commit('addFee',fee);
    },
    removeFee(context,feeid){
      context.commit('removeFee',feeid);
    },
  } 
})
