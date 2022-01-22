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

const commonData = [
  { text: "AAA", value: "aaa" },
  { text: "BBB", value: "bbb" },
  { text: "CCC", value: "ccc" },
  { text: "DDD", value: "ddd" },
  { text: "EEE", value: "eee" },
  { text: "FFF", value: "fff" },
  { text: "GGG", value: "ggg" },
];

const commonProps = {
  cancelTxt: "cancel",
  confirmTxt: "confirm",
};

export const Single = Template.bind({});
Single.args = {
  ...commonProps,
  title: "single",
  data: [commonData],
  selectedIndex: [4],
};

export const Double = Template.bind({});
Double.args = {
  ...commonProps,
  title: "double",
  data: [commonData, commonData],
  selectedIndex: [3, 4],
};

export const Triple = Template.bind({});
Triple.args = {
  ...commonProps,
  title: "triple",
  data: [commonData, commonData, commonData],
  selectedIndex: [2, 3, 4],
};
