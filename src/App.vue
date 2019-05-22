<template>
  <div id="app">
    <div class="sidebar">
      <Sidebar :showingSidebar="showingSidebar"/>
    </div>

    <div class="page-scroll" :class="{'s-sidebar': showingSidebar}">
      <transition name="swingin" appear>
        <Invoice v-bind:key="activeInvoice" :activeInvoice="activeInvoice"/>
      </transition>
      <div class="sidebar-open-click-overlay" @click="toggleSidebar" v-if="showingSidebar"></div>
      <button class="menu-button" @click="toggleSidebar">{{ showingSidebar ? 'Hide' : 'Show' }} Menu</button>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import Invoice from "./components/Invoice";

export default {
  name: "App",
  components: {
    Invoice,
    Sidebar
  },
  mounted: function() {
    this.$store.dispatch("loadAllInvoices");

    document.body.ontouchmove = e => {
      e.preventDefault;
      return false;
    };
  },
  computed: {
    activeInvoice() {
      return this.$store.getters["activeInvoice"];
    },
    showingSidebar() {
      return this.$store.getters["showingSidebar"];
    }
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch("toggleSidebar");
    }
  },
  data() {
    return {};
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
  //overflow: hidden;
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
  -webkit-overflow-scrolling: touch;
  transition: transform 0.2s ease-in-out;
  padding: 20px 0 0;
  display: grid;

  @include breakpoint(m) {
    padding: 20px 20px 0;
  }

  &.s-sidebar .page {
    transform: translateX(200px) scale(0.9);
    opacity: 0.5;
    pointer-events: none;
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
    display: block;
    width: calc(100% - 24mm);
  }

  .page-scroll {
    overflow: hidden;
    width: 100%;
  }

  .page {
    box-shadow: none;
    padding: 0;
    width: 100%;
    max-width: 100%;
  }

  .t-placeholder {
    display: none;
  }

  footer,
  .savedInvoices {
    display: none;
  }
}
</style>
