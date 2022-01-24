import picker from "../components/picker.vue";
export default { title: "Advanced", component: picker };

const Template = () => ({
  components: { picker },
  template: `
    <div>
    <button @click="show = true">Show</button>
    <div>
      <h2>change event parameter</h2>
      <div>{{ currentState }}</div>
    </div>
    <div>
      <h2>select event parameter</h2>
      <div>{{ selectedState }}</div>
    </div>

    <picker
      v-model="show"
      @change="onChange"
      @select="onSelect"
      :data="data"
      title="DatePicker"
    />
  </div>
  `,
  data: () => ({
    show: true,
    currentState: null,
    selectedState: null,
    selectedYear: null,
    selectedMonth: null,
    selectedDay: null,
    data: generatePickerData(2020, 6),
  }),
  methods: {
    onChange(state) {
      this.currentState = state;
      const year = state[0].value;
      const month = state[1].value;
      if (year !== this.selectedYear || month !== this.selectedMonth) {
        this.data = generatePickerData(year, month);
      }
    },
    onSelect(state) {
      this.selectedState = state;
      this.selectedYear = state[0].value;
      this.selectedMonth = state[1].value;
      this.selectedDay = state[2].value;
    },
  },
});

const generateYears = (minYear = 2010) => {
  const years = [];
  const thisYear = new Date().getFullYear();
  for (let year = minYear; year <= thisYear; year++) {
    years.push(year);
  }
  return years;
};

const generateMonths = () => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
};

const generateDays = (year, month) => {
  const lastDay = new Date(year, month, 0).getDate();
  const days = [];
  for (let day = 1; day <= lastDay; day++) {
    days.push(day);
  }
  return days;
};

const generatePickerData = (baseYear, baseMonth) => {
  const years = generateYears();
  const months = generateMonths();
  const days = generateDays(baseYear, baseMonth);

  return [
    years.map((year) => ({ value: year, text: year.toString() })),
    months.map((month) => ({ value: month, text: month.toString() })),
    days.map((day) => ({ value: day, text: day.toString() })),
  ];
};

export const Advanced = Template.bind({});
