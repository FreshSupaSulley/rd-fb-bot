<!-- async because we have a top-level await when we fetch the enabled flag -->
<!-- ... do we also handle the logic when that fails? -->
<script lang="ts" setup async>
import { ref, watch } from 'vue';
const stored = await browser.storage.local.get(["state", "delay"]);
let state = ref<number>(Number(stored.state ?? 0));
let delay = ref<number>(Number(stored.delay ?? 2000));

// When the checkbox changes we update sync
watch(state, (newVal, oldVal) => {
  console.log("New state value:", state);
  browser.storage.local.set({ state: newVal }).then(() => {
    browser.tabs.reload();
  }).catch(e => {
    console.error("Failed to update state", e);
    // TODO: implement a notification somewhere (overkill) when things to wrong (get a Vue framework??)
    // DONT reset the value cause it creates an endless callback due to watch()
    // checked.value = oldVal;
  });
});

// Watch the slider too
watch(delay, (newVal, oldVal) => {
  browser.storage.local.set({ delay: newVal }).catch(e => {
    console.error("Failed to update delay", e);
    // delay.value = oldVal;
  });
});

function msToSeconds(num: number) {
  return `${num / 1000}s`;
}
</script>

<template>
  <div style="text-align: center; max-width: 400px; margin: 0 auto;">
    <h1>Rick's Deals Facebook Bot</h1>
    <el-divider />

    <!-- Switch state -->
    <el-radio-group v-model="state" type="button">
      <!-- :value instead of value so it gets treated as numbers -->
      <el-radio :value="0">Off</el-radio>
      <el-radio :value="1">Select post</el-radio>
      <el-radio :value="2">On</el-radio>
    </el-radio-group>


    <!-- Slider -->
    <div style="margin: 10px">
      <h3 style="margin-bottom: 0">Delay: {{ msToSeconds(delay) }}</h3>
      <el-slider v-model="delay" :min="2000" :max="15000" :step="500" :format-tooltip="msToSeconds" />
    </div>
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  width: 30px;
  height: 30px;
}
</style>
