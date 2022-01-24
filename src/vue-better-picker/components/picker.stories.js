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
      <pre v-if="state">{{ state }}</pre>
      <picker v-model="show" ref="picker" @select="(...result) => state = result" v-bind="args" />
    </div>
  `,
  data: () => ({
    show: true,
    state: null,
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
