# vue-better-picker

![image](https://user-images.githubusercontent.com/16274215/150684460-256048c4-fce5-4550-88b8-ee0f1060e07d.png)

Mobile picker component for Vue 3 that forked from [openfe-openfe/vue-better-picker](https://github.com/openfe-openfe/vue-better-picker).

## Install

```bash
$ yarn add vue-3-better-picker
# npm install vue-3-better-picker --save
```

## Usage

```vue
<template>
  <div>
    <BetterPicker v-model="show" :data="pickerData" @select="onSelect" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BetterPicker from "vue-3-better-picker";

const show = ref(true);
const pickerData = [
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
const onSelect = (selectedValues) => {
  console.log(selectedValues);
};
</script>
```

## Props

|name|type|description|
|---|---|---|
|modelValue|Array|Basic object for picker (Usually bound by v-model)|
|title|String|Text displayed in the top center|
|cancelText|String|Cancel button text|
|confirmText|Array|OK button text|
|selectedIndex|Array|Initial values of the selected state|

## Contribution

You can start developing immediately with the following command and open http://localhost:8080.

```bash
$ yarn dev
```

Please feel free to create a PR or Issue.