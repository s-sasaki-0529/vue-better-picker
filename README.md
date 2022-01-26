# vue-better-picker

![image](https://user-images.githubusercontent.com/16274215/150684460-256048c4-fce5-4550-88b8-ee0f1060e07d.png)

Mobile picker component for Vue 3 that forked from [openfe-openfe/vue-better-picker](https://github.com/openfe-openfe/vue-better-picker).

## Demo

Open [Storybook](https://vue-better-picker-storybook.netlify.app/) or scan the QR code below with your mobile device.

![QR](https://user-images.githubusercontent.com/16274215/150636869-88959dd5-5eef-469d-a2ed-087b47fc8435.png)

## Install

```bash
$ yarn add vue-3-better-picker
# npm install vue-3-better-picker --save
```

## Usage

```vue
<template>
  <div>
    <BetterPicker
      ref="picker"
      @select="(...args) => (selectedValues = args)"
      :modelValue="pickerData"
    />
  </div>
</template>

<script>
import BetterPicker from "vue-3-better-picker";

export default {
  components: { BetterPicker },
  data() {
    return {
      state: {},
    };
  },
  computed: {
    pickerData() {
      return [
        // left slot
        [
          { value: "a", text: "A" },
          { value: "b", text: "B" },
          { value: "c", text: "C" },
        ],
        // center slot
        [
          { value: "a", text: "A" },
          { value: "b", text: "B" },
          { value: "c", text: "C" },
        ],
        // right slot
        [
          { value: "a", text: "A" },
          { value: "b", text: "B" },
          { value: "c", text: "C" },
        ],
      ];
    },
  },
  mounted() {
    this.$refs.picker.show();
  },
};
</script>
```

## Props

|name|type|description|
|---|---|---|
|modelValue|Array|Basic object for picker|
|title|String|Text displayed in the top center|
|cancelText|String|Cancel button text|
|confirmText|Array|OK button text|
|selectedIndex|Array|Initial values of the selected state|

## Caution

There will be some breaking changes in v1.0.0, so please be careful when using v0.x.