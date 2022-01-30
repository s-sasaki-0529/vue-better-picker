import { reactive } from "vue-demi";

export default function useDatePicker() {
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

  const generateDays = (year: number, month: number) => {
    const lastDay = new Date(year, month, 0).getDate();
    const days = [];
    for (let day = 1; day <= lastDay; day++) {
      days.push(day);
    }
    return days;
  };

  const generatePickerData = (baseYear: number, baseMonth: number) => {
    const years = generateYears();
    const months = generateMonths();
    const days = generateDays(baseYear, baseMonth);

    return [
      years.map((year) => ({ value: year, text: year.toString() })),
      months.map((month) => ({ value: month, text: ("00" + month).slice(-2) })),
      days.map((day) => ({ value: day, text: ("00" + day).slice(-2) })),
    ];
  };

  const state = reactive({
    selectedYear: null as number | null,
    selectedMonth: null as number | null,
    selectedDay: null as number | null,
    data: generatePickerData(2020, 8),
  });

  function onChange(newData: typeof state["data"][0]) {
    const year = newData[0].value;
    const month = newData[1].value;
    if (year !== state.selectedYear || month !== state.selectedMonth) {
      state.data = generatePickerData(year, month);
    }
  }

  function onSelect(newData: typeof state["data"][0]) {
    state.selectedYear = newData[0].value;
    state.selectedMonth = newData[1].value;
    state.selectedDay = newData[2].value;
  }

  return {
    state,
    onChange,
    onSelect,
  };
}
