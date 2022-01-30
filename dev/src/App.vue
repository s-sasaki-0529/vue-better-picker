<template>
  <div class="root">
    <button @click="state.showSingle = true">Single column</button>
    <button @click="state.showDouble = true">Double columns</button>
    <button @click="state.showTriple = true">Triple columns</button>
    <button @click="state.showAdvanced = true">Advanced(DatePicker)</button>

    <div class="single-picker">
      <Picker
        v-model="state.showSingle"
        title="Single"
        confirmText="confirm"
        cancelText="cancel"
        :data="singleData"
        @change="(args) => (state.argsOfChangeEvent = args)"
        @select="(args) => (state.argsOfSelectEvent = args)"
      />
    </div>

    <div class="double-picker">
      <Picker
        v-model="state.showDouble"
        title="Double"
        confirmText="YES"
        cancelText="NO"
        :data="doubleData"
        :selectedIndex="[13, 14]"
        @change="(args) => (state.argsOfChangeEvent = args)"
        @select="(args) => (state.argsOfSelectEvent = args)"
      />
    </div>

    <div class="triple-picker">
      <Picker
        v-model="state.showTriple"
        title="Triple"
        confirmText="確定"
        cancelText="キャンセル"
        :data="tripleData"
        :selectedIndex="[12, 13, 14]"
        @change="(args) => (state.argsOfChangeEvent = args)"
        @select="(args) => (state.argsOfSelectEvent = args)"
      />
    </div>

    <div class="advanced-picker">
      <Picker
        v-model="state.showAdvanced"
        :data="datePicker.state.data"
        :selectedIndex="[12, 0, 30]"
        @change="
          (args) => {
            datePicker.onChange(args);
            state.argsOfChangeEvent = args;
          }
        "
        @select="
          (args) => {
            datePicker.onSelect(args);
            state.argsOfSelectEvent = args;
          }
        "
      />
    </div>

    <div>
      <h2>Arguments of the change event</h2>
      <div class="args-of-change-event">
        {{ JSON.stringify(state.argsOfChangeEvent) }}
      </div>
    </div>
    <div>
      <h2>Arguments of the select event</h2>
      <div class="args-of-select-event">
        {{ JSON.stringify(state.argsOfSelectEvent) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";
import { reactive } from "vue-demi";
import Picker from "../../src/vue-better-picker/components/picker.vue";
import useDatePicker from "./useDatePicker";

export default defineComponent({
  components: { Picker },
  setup() {
    const state = reactive({
      showSingle: false,
      showDouble: false,
      showTriple: false,
      showAdvanced: false,
      argsOfChangeEvent: {},
      argsOfSelectEvent: {},
    });
    const datePicker = useDatePicker();

    const commonData = "abcdefghijklmnopqrstuvwxyz"
      .split("")
      .map((char) => ({ value: char, text: char.toUpperCase() }));

    const singleData = [commonData];
    const doubleData = [commonData, commonData];
    const tripleData = [commonData, commonData, commonData];

    return { state, datePicker, singleData, doubleData, tripleData };
  },
});
</script>

<style scoped>
.root button {
  width: 100%;
  margin: 0.5rem;
}
</style>
