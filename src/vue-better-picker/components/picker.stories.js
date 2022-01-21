import picker from "./picker.vue";
export default { title: "sample" };

const Template = (args, { argTypes }) => ({
  components: { picker },
  props: Object.keys(argTypes),
  template: `
    <div>
      <button @click="show">show</button>
      <picker ref="picker" :data="[[['aaa', 'bbb'], ['ccc', 'ddd'], ['eee','fff']]]"/>
    </div>
  `,
  methods: {
    show() {
      this.$refs.picker.show();
    },
  },
});

export const Default = Template.bind({});
