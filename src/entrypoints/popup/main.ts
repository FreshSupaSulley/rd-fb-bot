import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// ElementPlus bs
// https://element-plus.org/en-US/guide/quickstart
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");
