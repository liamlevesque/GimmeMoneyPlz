export const selectAll = {
  methods: {
    selectAll(e) {
      window.getSelection().selectAllChildren(e.currentTarget);
    },
    selectAllInput(e) {
      e.currentTarget.select();
    }
  }
};
