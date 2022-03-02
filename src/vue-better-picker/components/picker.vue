<template>
  <transition name="picker-fade">
    <div v-show="value" class="picker" @touchmove.prevent @click="cancel">
      <transition name="picker-move">
        <div v-show="value" class="picker-panel" @click.stop>
          <div class="picker-choose border-bottom-1px">
            <span class="cancel" @click="cancel" v-text="cancelText" />
            <span class="confirm" @click="confirm" v-text="confirmText" />
            <h1 class="picker-title" v-text="title" />
          </div>
          <div class="picker-content">
            <div class="mask-top border-bottom-1px" />
            <div class="mask-bottom border-top-1px" />
            <div ref="wheelWrapper" class="wheel-wrapper">
              <div v-for="(dataSet, i) in pickerData" :key="i" class="wheel">
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

<script>
import BScroll from "@better-scroll/core";
import Wheel from "@better-scroll/wheel";
BScroll.use(Wheel);

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array,
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
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["input", "select", "cancel", "change"],
  data() {
    return {
      pickerData: this.data,
      pickerSelectedIndex: this.selectedIndex,
      pickerSelectedVal: [],
      pickerSelectedText: [],
      wheels: [],
      dirty: false,
    };
  },
  computed: {
    wheelWrapper() {
      return this.$refs.wheelWrapper;
    },
  },
  watch: {
    data(newData) {
      this.refill(newData);
      this.pickerData = newData;
      this.dirty = true;
    },
    value: {
      handler(newValue) {
        if (newValue) this.show();
        else this.hide();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    if (!this.selectedIndex.length) {
      this.pickerSelectedIndex = [];
      for (let i = 0; i < this.pickerData.length; i++) {
        this.pickerSelectedIndex[i] = 0;
      }
    }
  },
  methods: {
    getWheelState() {
      return this.pickerData.map((_, i) => {
        const index = this.wheels[i].getSelectedIndex();
        return {
          index,
          value: this.pickerData[i][index].value,
          text: this.pickerData[i][index].text,
        };
      });
    },
    confirm() {
      if (!this.canConfirm()) return;

      const wheelState = this.getWheelState();
      this.pickerSelectedIndex = wheelState.map((state) => state.index);
      this.pickerSelectedVal = wheelState.map((state) => state.value);
      this.pickerSelectedText = wheelState.map((state) => state.text);

      this.$emit("select", wheelState);
      this.$emit("input", false);
    },
    cancel() {
      this.$emit("input", false);
      this.$emit("cancel");
    },
    show() {
      if (this.wheels.length === 0 || this.dirty) {
        this.$nextTick(() => {
          this.wheels = [];
          for (let i = 0; i < this.pickerData.length; i++) {
            this.createWheel(i);
          }
          this.dirty = false;
          this.$emit("change", this.getWheelState());
        });
      } else {
        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].enable();
          this.wheels[i].wheelTo(this.pickerSelectedIndex[i]);
        }
      }
    },
    hide() {
      if (!this.wheels.length) return;

      for (let i = 0; i < this.pickerData.length; i++) {
        this.wheels[i].disable();
      }
    },
    refill(pickerData) {
      if (!pickerData.length) return;
      pickerData.forEach((wheelColumn, index) => {
        this.refillColumn(index, wheelColumn);
      });
    },
    refillColumn(index, wheelSlot) {
      if (!this.value) {
        console.error("can not use refillColumn when picker is not show");
        return;
      }

      const wheelWrapperElement = this.wheelWrapper;
      if (wheelWrapperElement === null) throw new Error("wheel-wrapper not found.");

      const scrollElement = wheelWrapperElement.children[index].querySelector(".wheel-scroll");
      if (!scrollElement) return;

      const oldData = this.pickerData[index];
      this.pickerData[index] = wheelSlot;

      const selectedIndex = this.wheels[index].getSelectedIndex();
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
      this.pickerSelectedIndex[index] = dist;
      this.$nextTick(() => {
        this.wheels[index] = this.createWheel(index);
        this.wheels[index].wheelTo(dist);
      });
    },
    createWheel(i) {
      if (this.wheels[i]) {
        this.wheels[i].refresh();
        return this.wheels[i];
      }

      const wheelWrapperElement = this.wheelWrapper;
      if (wheelWrapperElement === null) throw new Error("wheel-wrapper element is not found.");
      this.wheels[i] = new BScroll(wheelWrapperElement.children[i], {
        wheel: {
          selectedIndex: this.pickerSelectedIndex[i],
        },
        probeType: 3,
      });
      this.wheels[i].on("scrollEnd", () => {
        this.$emit("change", this.getWheelState());
      });

      return this.wheels[i];
    },
    canConfirm() {
      return this.wheels.every((wheel) => !wheel.isInTransition);
    },
  },
};
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
