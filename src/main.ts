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

// type D = L.Icon.Default & {
//     _getIconUrl?: string;
//   };
  
// delete (L.Icon.Default.prototype as D)._getIconUrl;

const app = createApp(App);

app.use(L);
app.use(router);
app.use(PrimeVue);

app.mount("#app");
