Component({
  properties: {
    tags: {
      type: Array,
      value: [],
      observer(newVal) {
        newVal && this.setData({
          tempTags: newVal
        });
      }
    }
  },
  data: {
    tempTags: []
  },
  methods: {
    tapChangeHandler(e) {
      const idxs = e.detail.value;
      this.data.tags.forEach(item => {
        if (idxs.indexOf(item.value) !== -1) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.setData({
        tempTags: this.data.tags
      });
      this.triggerEvent('tagchecked', idxs);
    }
  }
});
