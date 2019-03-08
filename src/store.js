import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const baseState = {
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
  invoiceTotal: 0
};

export default new Vuex.Store({
  state: {
    invoices: [],
    activeInvoice: null,
    ...baseState
  },
  getters: {
    invoices: state => {
      return state.invoices;
    },
    activeInvoice: state => {
      return state.activeInvoice;
    },
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
    totalFees: (state, getters) => {
      return state.fees.reduce((total, current) => {
        if (current.type === "percent")
          return (total +=
            (parseFloat(current.amount) / 100) * getters.subTotal);
        else return (total += parseInt(current.amount, 10));
      }, 0);
    }
  },
  mutations: {
    addTask(state, task) {
      state.tasks.push(task);
    },
    removeTask(state, taskid) {
      state.tasks = state.tasks.filter(task => task.id !== taskid);
    },
    addFee(state, fee) {
      state.fees.push(fee);
    },
    removeFee(state, feeid) {
      state.fees = state.fees.filter(fee => fee.id !== feeid);
    },
    loadAllInvoices(state) {
      state.invoices = JSON.parse(window.localStorage.getItem("invoices"));
    },
    loadInvoice(state, invoiceId) {
      //Get invoice data from localstorage
      const newInvoice = JSON.parse(window.localStorage.getItem(invoiceId));
      //Assign that invoice to state. don't replace the list of invoices and set this to the active invoice
      Object.assign(state, {
        invoices: state.invoices,
        activeInvoice: invoiceId,
        ...newInvoice
      });
    },
    saveInvoice(state, invoiceName) {
      //Get the state without the invoices
      const { invoices, activeInvoice, ...stateWithoutInvoices } = state;

      //Create a record of this invoice for retrieval later
      const invoiceRecord = {
        id: new Date().getTime(),
        name: invoiceName
      };

      //Grab the invoice data and create an object with all of the details and info
      const invoice = {
        ...stateWithoutInvoices,
        ...invoiceRecord
      };

      //Save the invoice data to local storage
      window.localStorage.setItem(invoiceRecord.id, JSON.stringify(invoice));
      //Add this invoice into the state's version of the invoices
      state.invoices.push(invoiceRecord);
      //Save the set of invoices to localstorage
      window.localStorage.setItem("invoices", JSON.stringify(state.invoices));
    },
    createNewInvoice(state) {
      //Assign the base state back to state, but don't replace the list of invoices. Set the active invoice to null
      Object.assign(state, {
        invoices: state.invoices,
        activeInvoice: null,
        ...baseState
      });
    },
    updateInvoice(state) {
      //Get the state without the invoices
      const { invoices, activeInvoice, ...stateWithoutInvoices } = state;

      window.localStorage.setItem(
        state.activeInvoice,
        JSON.stringify(stateWithoutInvoices)
      );
    }
  },
  actions: {
    addTask(context, task) {
      context.commit("addTask", task);
    },
    removeTask(context, taskid) {
      context.commit("removeTask", taskid);
    },
    addFee(context, fee) {
      context.commit("addFee", fee);
    },
    removeFee(context, feeid) {
      context.commit("removeFee", feeid);
    },
    saveInvoice(context, invoiceName) {
      context.commit("saveInvoice", invoiceName);
    },
    loadAllInvoices(context) {
      context.commit("loadAllInvoices");
    },
    updateInvoice(context) {
      context.commit("updateInvoice");
    },
    loadInvoice(context, invoiceId) {
      context.commit("loadInvoice", invoiceId);
    },
    createNewInvoice(context) {
      context.commit("createNewInvoice");
    }
  }
});
