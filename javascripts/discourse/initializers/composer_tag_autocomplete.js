import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-tag-autocomplete",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      console.log("test");
      const chat = api.container.lookup("service:chat");

      debugger
      if (chat) {
        console.log("test");
      }
    });
  },
};
