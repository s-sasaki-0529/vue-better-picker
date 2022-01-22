import picker from "./picker.vue";
export default { title: "picker", component: picker };

const Template = (args, { argTypes }) => ({
  components: { picker },
  props: Object.keys(argTypes),
  template: `
    <div>
      <button @click="show">show</button>
      <pre v-if="state">{{ state }}</pre>
      <picker ref="picker" @select="(...args) => state = args" v-bind="$props" />
    </div>
  `,
  data: () => ({
    state: null,
  }),
  mounted() {
    this.show();
  },
  methods: {
    show() {
      this.$refs.picker.show();
    },
  },
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
