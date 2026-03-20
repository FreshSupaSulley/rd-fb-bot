<!-- async because we have a top-level await when we fetch the enabled flag -->
<!-- ... do we also handle the logic when that fails? -->
<script lang="ts" setup async>
import { ref, watch } from 'vue';
const stored = await browser.storage.local.get(["enabled", "delay"]);
let checked = ref<boolean>(!!stored.enabled);
let delay = ref<number>(Number(stored.delay ?? 2000));

// When the checkbox changes we update sync
watch(checked, (newVal, oldVal) => {
  console.log("New value:", checked);
  browser.storage.local.set({ enabled: newVal }).then(() => {
    browser.tabs.reload();
  }).catch(e => {
    console.error("Failed to update enabled flag", e);
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
</script>

<template>
  <h1>Rick's Deals Facebook Bot</h1>
  <hr>
  <br>
  <!-- Checkbox to enable this thing -->
  <div style="display: flex; align-items: center; justify-self: center; gap: 0.2rem; padding-bottom: 1rem">
    <input type="checkbox" id="checkbox" v-model="checked" />
    <label for="checkbox">{{ checked ? "On" : "Off" }}</label>
  </div>
  <!-- Slider -->
  <div>
    <p>Delay (ms): {{ delay }}</p>
    <div class="row">
      <input type="range" min="2000" max="15000" step="500" v-model="delay" />
    </div>
  </div>
  <br>
</template>

<style scoped>
input[type="checkbox"] {
  width: 30px;
  height: 30px;
}
</style>
