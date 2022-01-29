<template>
  <transition name="picker-fade">
    <div v-show="props.modelValue" class="picker" @touchmove.prevent @click="cancel">
      <transition name="picker-move">
        <div v-show="props.modelValue" class="picker-panel" @click.stop>
          <div class="picker-choose border-bottom-1px">
            <span class="cancel" @click="cancel" v-text="props.cancelText" />
            <span class="confirm" @click="confirm" v-text="props.confirmText" />
            <h1 class="picker-title" v-text="props.title" />
          </div>
          <div class="picker-content">
            <div class="mask-top border-bottom-1px" />
            <div class="mask-bottom border-top-1px" />
            <div ref="wheelWrapper" class="wheel-wrapper">
              <div v-for="(dataSet, i) in state.pickerData" :key="i" class="wheel">
                <ul class="wheel-scroll">
                  <li v-for="(item, s) in dataSet" :key="s" class="wheel-item">
                    {{ item.text }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="picker-footer" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType, reactive, ref, watch } from "vue";
import BScroll from "@better-scroll/core";
import Wheel from "@better-scroll/wheel";
BScroll.use(Wheel);

// FIXME: Move type definitions to different file
type PickerData = WheelColumn[];
type WheelColumn = WheelSlot[];
type WheelSlot = { text: string; value: any }; // FIXME: any 消せると非常にうれしい
type WheelState = { index: number } & WheelSlot;
type ExpandedBScroll = BScroll & {
  getSelectedIndex: () => number;
};

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array as PropType<PickerData>,
      required: true,
    },
    title: {
      type: String,
      default: "Picker",
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
    confirmText: {
      type: String,
      default: "OK",
    },
    selectedIndex: {
      type: Array as PropType<number[]>,
      default: () => {
        return [];
      },
    },
  },
  emits: ["update:modelValue", "select", "cancel", "change"],
  setup(props, { emit }) {
    const wheelWrapper = ref<HTMLElement | null>(null);
    const state = reactive({
      pickerData: props.data,
      pickerSelectedIndex: props.selectedIndex,
      pickerSelectedVal: [] as WheelSlot["value"][],
      pickerSelectedText: [] as WheelSlot["text"][],
      wheels: [] as ExpandedBScroll[],
      dirty: false,
    });

    watch(
      () => props.data,
      (newData) => {
        refill(newData);
        state.pickerData = newData;
        state.dirty = true;
      }
    );

    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue) show();
        else hide();
      },
      {
        immediate: true,
        deep: true,
      }
    );

    if (!props.selectedIndex.length) {
      state.pickerSelectedIndex = [];
      for (let i = 0; i < state.pickerData.length; i++) {
        state.pickerSelectedIndex[i] = 0;
      }
    }

    function getWheelState(): WheelState[] {
      return state.pickerData.map((_, i) => {
        const index = state.wheels[i].getSelectedIndex();
        return {
          index,
          value: state.pickerData[i][index].value,
          text: state.pickerData[i][index].text,
        };
      });
    }

    function confirm() {
      if (!canConfirm()) return;

      const wheelState = getWheelState();
      state.pickerSelectedIndex = wheelState.map((state) => state.index);
      state.pickerSelectedVal = wheelState.map((state) => state.value);
      state.pickerSelectedText = wheelState.map((state) => state.text);

      emit("select", wheelState);
      emit("update:modelValue", false);
    }

    function cancel() {
      emit("update:modelValue", false);
      emit("cancel");
    }

    function show() {
      if (state.wheels.length === 0 || state.dirty) {
        nextTick(() => {
          state.wheels = [];
          for (let i = 0; i < state.pickerData.length; i++) {
            createWheel(i);
          }
          state.dirty = false;
          emit("change", getWheelState());
        });
      } else {
        for (let i = 0; i < state.pickerData.length; i++) {
          state.wheels[i].enable();
          state.wheels[i].wheelTo(state.pickerSelectedIndex[i]);
        }
      }
    }

    function hide() {
      if (!state.wheels.length) return;

      for (let i = 0; i < state.pickerData.length; i++) {
        state.wheels[i].disable();
      }
    }

    function refill(pickerData: PickerData) {
      if (!pickerData.length) return;
      pickerData.forEach((wheelColumn, index) => {
        refillColumn(index, wheelColumn);
      });
    }

    function refillColumn(index: number, wheelSlot: WheelColumn) {
      if (!props.modelValue) {
        console.error("can not use refillColumn when picker is not show");
        return;
      }

      const wheelWrapperElement = wheelWrapper.value;
      if (wheelWrapperElement === null) throw new Error("wheel-wrapper not found.");

      const scrollElement = wheelWrapperElement.children[index].querySelector(".wheel-scroll");
      if (!scrollElement) return;

      const oldData = state.pickerData[index];
      state.pickerData[index] = wheelSlot;

      const selectedIndex = state.wheels[index].getSelectedIndex();
      let dist = 0;
      if (oldData.length) {
        const oldValue = oldData[selectedIndex].value;
        for (let i = 0; i < wheelSlot.length; i++) {
          if (wheelSlot[i].value === oldValue) {
            dist = i;
            break;
          }
        }
      }
      state.pickerSelectedIndex[index] = dist;
      nextTick(() => {
        state.wheels[index] = createWheel(index);
        state.wheels[index].wheelTo(dist);
      });
    }

    function createWheel(i: number) {
      if (state.wheels[i]) {
        state.wheels[i].refresh();
        return state.wheels[i];
      }

      const wheelWrapperElement = wheelWrapper.value;
      if (wheelWrapperElement === null) throw new Error("wheel-wrapper element is not found.");
      state.wheels[i] = new BScroll(wheelWrapperElement.children[i] as HTMLElement, {
        wheel: {
          selectedIndex: state.pickerSelectedIndex[i],
        },
        probeType: 3,
      });
      state.wheels[i].on("scrollEnd", () => {
        emit("change", getWheelState());
      });

      return state.wheels[i];
    }

    function canConfirm() {
      return state.wheels.every((wheel) => !wheel.isInTransition);
    }

    return { props, state, cancel, confirm, wheelWrapper };
  },
});
</script>

<style scoped lang="scss">
@import "../styles/base.scss";
@import "../styles/variable.scss";

.picker {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
  font-size: $fontsize-medium;
  background-color: $color-mask-bgc;
  .picker-panel {
    position: absolute;
    z-index: 600;
    bottom: 0;
    width: 100%;
    height: 273px;
    background: $color-white;
    .picker-choose {
      position: relative;
      height: 60px;
      color: $color-light-grey;
      .picker-title {
        margin: 0;
        line-height: 60px;
        font-weight: normal;
        text-align: center;
        font-size: $fontsize-large-x;
        color: $color-dark-grey;
      }
      .confirm {
        right: 0;
        color: $color-main;
        &:active {
          color: $color-main-ll;
        }
      }
      .cancel {
        left: 0;
        &:active {
          color: $color-active-light-gray-fe;
        }
      }
    }
    .picker-content {
      position: relative;
      top: 20px;
      .mask-top {
        position: absolute;
        top: 0;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
      }
      .mask-bottom {
        position: absolute;
        bottom: 1px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
      }
    }
    .wheel-wrapper {
      display: flex;
      padding: 0 16px;
      justify-content: space-around;
      .wheel {
        height: 173px;
        overflow: hidden;
        font-size: $fontsize-large-xx;
        .wheel-scroll {
          padding: 0;
          margin-top: 68px;
          line-height: 36px;
          list-style: none;
          .wheel-item {
            list-style: none;
            height: 36px;
            overflow: hidden;
            white-space: nowrap;
            color: $color-dark-grey;
          }
        }
      }
    }
  }
  .picker-footer {
    height: 20px;
  }
}
.picker.picker-fade-enter-from,
.picker.picker-fade-leave-active {
  opacity: 0;
}
.picker.picker-fade-enter-active,
.picker.picker-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.picker .picker-panel.picker-move-enter-from,
.picker .picker-panel.picker-move-leave-active {
  transform: translate3d(0, 273px, 0);
}
.picker .picker-panel.picker-move-enter-active,
.picker .picker-panel.picker-move-leave-active {
  transition: all 0.3s ease-in-out;
}
.picker .picker-panel .picker-choose .confirm,
.picker .picker-panel .picker-choose .cancel {
  position: absolute;
  top: 6px;
  padding: 16px;
  font-size: $fontsize-medium;
}
.picker .picker-panel .picker-content .mask-top,
.picker .picker-panel .picker-content .mask-bottom {
  z-index: 10;
  width: 100%;
  height: 68px;
  pointer-events: none;
  transform: translateZ(0);
}
</style>
