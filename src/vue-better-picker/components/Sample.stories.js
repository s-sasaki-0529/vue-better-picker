export default { title: "sample" };

const Template = (args, { argTypes }) => ({
  components: {},
  props: Object.keys(argTypes),
  template: `<div>Hello, World!</div>`,
});

export const Default = Template.bind({});
