import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import router from "./routes/router";
import L from "leaflet";

import "@/styles/_global.scss";
import "primevue/resources/themes/lara-light-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "leaflet/dist/leaflet.css";

const app = createApp(App);

app.use(L);
app.use(router);
app.use(PrimeVue);

app.mount("#app");
