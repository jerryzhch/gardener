import $ from "dom7";
import Framework7 from "framework7/bundle";
import { loadingUserData } from "./loading";
import { addToLocaleStorage } from "./helper";

// Import F7 Styles
import "framework7/framework7-bundle.css";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.less";

// Import Routes
import routes from "./routes.js";

// Import main app component
import App from "../app.f7";

var app = new Framework7({
  name: "Gardener", // App name
  theme: "ios", // Automatic theme detection
  el: "#app", // App root element
  component: App, // App main component

  on: {
    init: function () {
      console.log("App initialized");
    },
    pageInit: async function () {
      console.log("Page initialized");
      await startListeners();
    },
  },
  // App routes
  routes: routes,
  // Register service worker (only on production build)
  serviceWorker:
    process.env.NODE_ENV === "production"
      ? {
          path: "/service-worker.js",
        }
      : {},
});
var lat = 46.743552;
var lng = 9.5551488; //Zurich Technopark

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
  });
}

async function startListeners() {
  addToLocaleStorage("day", true);
  var mainView = app.view.main;
  var greetingText = "Good ";
  var daytime;
  var nighttime;
  var afternoontime;
  var morningTime;
  var eveningTime;
  const greetingTitle = $(".greeting");
  app.request
    .json(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&formatted=0`
    )
    .then((res) => {
      var sunrise = res.data.results.sunrise;
      var sunset = res.data.results.sunset;
      var solar_noon = res.data.results.solar_noon;

      nighttime = new Date(sunset);
      afternoontime = new Date(solar_noon);
      morningTime = new Date(sunrise);

      const timeDiff =
        new Date(solar_noon).getTime() - new Date(sunrise).getTime();
      daytime = new DataTransfer(morningTime.getTime() + timeDiff / 3);
      eveningTime = new Date(nighttime.getTime() - timeDiff / 3);

      const today = new Date();

      if (today >= eveningTime) {
        console.log("nsdnvfklassas");
        greetingText = greetingText + " Evening!";
        greetingTitle.text(greetingText);
        $("#page_").css("background-image", "url(../assets/img/sky-night.svg)");
        $("body").addClass("theme-dark");
        addToLocaleStorage("day", false);
      } else if (today >= afternoontime) {
        console.log("asasasass");
        greetingText = greetingText + " Afternoon!";
        greetingTitle.text(greetingText);
        $("#page_").css("background-image", "url(../assets/img/sky-day.svg)");
        $("body").removeClass("theme-dark");
        addToLocaleStorage("day", true);
      } else if (today >= daytime) {
        console.log("nsdnvfkl");
        greetingText = greetingText + " Morning!";
        greetingTitle.text(greetingText);
        $("#page_").css("background-image", "url(../assets/img/sky-day.svg)");
        $("body").removeClass("theme-dark");
        addToLocaleStorage("day", true);
      } else if (today >= morningTime) {
        console.log("nsdnvfkl");
        greetingText = greetingText + " Morning!";
        greetingTitle.text(greetingText);
        $("#page_").css("background-image", "url(../assets/img/sky-night.svg)");
        $("body").addClass("theme-dark");
        addToLocaleStorage("day", false);
      } else if (today < morningTime) {
        console.log("nsdnvfkl");
        greetingText = greetingText + " Night!";
        greetingTitle.text(greetingText);
        $("#page_").css("background-image", "url(../assets/img/sky-night.svg)");
        $("body").addClass("theme-dark");
        addToLocaleStorage("day", false);
      }
    });

  loadingUserData(mainView, false, app);

  $("#user-info").on("click", () => {
    app.popup.open("#user-modal", true);
  });
}

export default app;
