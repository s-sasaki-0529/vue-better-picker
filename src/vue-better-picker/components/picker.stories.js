import picker from "./picker.vue";
export default { title: "picker", component: picker };

const Template = (args) => ({
  components: { picker },
  setup() {
    return { args };
  },
  template: `
    <div>
      <button @click="show = true">Show</button>
      <div>
        <h2>change event parameter</h2>
        <div>{{ currentValues }}</div>
      </div>
      <div>
        <h2>select event parameter</h2>
        <div>{{ selectedValues }}</div>
      </div>

      <picker
        v-model="show"
        @change="(index, value) => currentValues = { index ,value }"
        @select="(...result) => selectedValues = result"
        v-bind="args"
      />
    </div>
  `,
  data: () => ({
    show: true,
    currentValues: null,
    selectedValues: null,
  }),
});

const commonData = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map((char) => ({ value: char, text: char.toUpperCase() }));

const commonProps = {
  cancelTxt: "cancel",
  confirmTxt: "confirm",
};

export const _1_Single = Template.bind({});
_1_Single.args = {
  ...commonProps,
  title: "single",
  data: [commonData],
  selectedIndex: [12],
};

export const _2_Double = Template.bind({});
_2_Double.args = {
  ...commonProps,
  title: "double",
  data: [commonData, commonData],
  selectedIndex: [13, 14],
};

export const _3_Triple = Template.bind({});
_3_Triple.args = {
  ...commonProps,
  title: "triple",
  data: [commonData, commonData, commonData],
  selectedIndex: [12, 13, 14],
};
