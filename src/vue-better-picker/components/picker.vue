<template>
  <transition name="picker-fade">
    <div v-show="modelValue" class="picker" @touchmove.prevent @click="cancel">
      <transition name="picker-move">
        <div v-show="modelValue" class="picker-panel" @click.stop>
          <div class="picker-choose border-bottom-1px">
            <span class="cancel" @click="cancel">{{ cancelTxt }}</span>
            <span class="confirm" @click="confirm">{{ confirmTxt }}</span>
            <h1 class="picker-title">
              {{ title }}
            </h1>
          </div>
          <div class="picker-content">
            <div class="mask-top border-bottom-1px" />
            <div class="mask-bottom border-top-1px" />
            <div class="wheel-wrapper">
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
import BScroll from "better-scroll";

export default {
  name: "BetterPicker",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      required: true,
    },
    cancelTxt: {
      type: String,
      default: "cancel",
    },
    confirmTxt: {
      type: String,
      default: "confirm",
    },
    selectedIndex: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "select", "cancel", "change"],
  data() {
    return {
      pickerData: this.data.slice(),
      pickerSelectedIndex: this.selectedIndex,
      pickerSelectedVal: [],
      pickerSelectedText: [],
      dirty: false,
    };
  },
  watch: {
    data: {
      handler(newData) {
        this.setData(newData);
      },
      immediate: true,
      deep: true,
    },
    modelValue: {
      handler(v) {
        if (v) this.show();
        else this.hide();
      },
      immediate: true,
    },
  },
  created() {
    if (!this.pickerSelectedIndex.length) {
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
      if (!this._canConfirm()) return;

      const wheelState = this.getWheelState();
      this.pickerSelectedIndex = wheelState.map((state) => state.index);
      this.pickerSelectedVal = wheelState.map((state) => state.value);
      this.pickerSelectedText = wheelState.map((state) => state.text);

      this.$emit("select", this.getWheelState());
      this.$emit("update:modelValue", false);
    },
    cancel() {
      this.$emit("update:modelValue", false);
      this.$emit("cancel");
    },
    show() {
      if (!this.wheels || this.dirty) {
        this.$nextTick(() => {
          this.wheels = [];
          let wheelWrapper = this.$el.querySelector(".wheel-wrapper");
          for (let i = 0; i < this.pickerData.length; i++) {
            this._createWheel(wheelWrapper, i);
          }
          this.dirty = false;
        });
      } else {
        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].enable();
          this.wheels[i].wheelTo(this.pickerSelectedIndex[i]);
        }
      }
    },
    hide() {
      for (let i = 0; i < this.pickerData.length; i++) {
        this.wheels[i].disable();
      }
    },
    setData(data) {
      this.pickerData = data.slice();
      this.dirty = true;
    },
    setSelectedIndex(index) {
      this.pickerSelectedIndex = index;
    },
    refill(datas) {
      let ret = [];
      if (!datas.length) {
        return ret;
      }
      datas.forEach((data, index) => {
        ret[index] = this.refillColumn(index, data);
      });
      return ret;
    },
    refillColumn(index, data) {
      if (!this.modelValue) {
        console.error("can not use refillColumn when picker is not show");
        return;
      }
      const wheelWrapper = this.$el.querySelector(".wheel-wrapper");
      let scroll = wheelWrapper.children[index].querySelector(".wheel-scroll");
      let wheel = this.wheels[index];
      if (scroll && wheel) {
        let oldData = this.pickerData[index];
        this.pickerData[index] = data;
        let selectedIndex = wheel.getSelectedIndex();
        let dist = 0;
        if (oldData.length) {
          let oldValue = oldData[selectedIndex].value;
          for (let i = 0; i < data.length; i++) {
            if (data[i].value === oldValue) {
              dist = i;
              break;
            }
          }
        }
        this.pickerSelectedIndex[index] = dist;
        this.$nextTick(() => {
          // recreate wheel so that the wrapperHeight will be correct.
          wheel = this._createWheel(wheelWrapper, index);
          wheel.wheelTo(dist);
        });
        return dist;
      }
    },
    scrollTo(index, dist) {
      const wheel = this.wheels[index];
      this.pickerSelectedIndex[index] = dist;
      wheel.wheelTo(dist);
    },
    refresh() {
      setTimeout(() => {
        this.wheels.forEach((wheel) => {
          wheel.refresh();
        });
      }, 200);
    },
    _createWheel(wheelWrapper, i) {
      if (!this.wheels[i]) {
        this.wheels[i] = new BScroll(wheelWrapper.children[i], {
          wheel: {
            selectedIndex: this.pickerSelectedIndex[i],
          },
          probeType: 3,
        });

        this.wheels[i].on("scrollEnd", () => {
          this.$emit("change", this.getWheelState());
        });
      } else {
        this.wheels[i].refresh();
      }

      return this.wheels[i];
    },
    _canConfirm() {
      return this.wheels.every((wheel) => {
        return !wheel.isInTransition;
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "../common/stylus/base.scss";
@import "../common/stylus/variable.scss";

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
        background: linear-gradient(
          to top,
          rgba(255, 255, 255, 0.4),
          rgba(255, 255, 255, 0.8)
        );
      }
      .mask-bottom {
        position: absolute;
        bottom: 1px;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.4),
          rgba(255, 255, 255, 0.8)
        );
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
