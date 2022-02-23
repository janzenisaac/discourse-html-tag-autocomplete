import { withPluginApi } from "discourse/lib/plugin-api";
import { findRawTemplate } from "discourse-common/lib/raw-templates";
import { SKIP } from "discourse/lib/autocomplete";
import Handlebars from "handlebars";
import TextareaTextManipulation from "discourse/mixins/textarea-text-manipulation";
import { getRegister } from "discourse-common/lib/get-owner";

export default {
  name: "discourse-tag-autocomplete",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      const chat = api.container.lookup("service:chat");

      if (chat) {
        chat.addAutocompleteFn(testFn);
      }

      console.log(findRawTemplate("html-tag-autocomplete"))
      let term;
      function testFn(chatComposer) {
        const textarea = $(chatComposer._textarea);
        textarea.autocomplete({
          template: findRawTemplate("html-tag-autocomplete"),
          key: "<",
          afterComplete: (text) => {
            chatComposer.set("value", text);
            chatComposer._focusTextArea();
            let selection = chatComposer.getSelected();
            chatComposer.selectText(selection.pre.length - term.length - 4, 0);
          },
          treatAsTextarea: true,
          transformComplete: (v) => {
            if (v.code) {
              term = v.code;
              return `${v.code}></${v.code}>`;
            } else {
              textarea.autocomplete({ cancel: true });
              return "";
            }
          },
          dataSource: (term) => {
            return new Promise((resolve) => {
              const full = `${term}`;
              term = term.toLowerCase();

              if (term === "") {
                return resolve(["kbd", "smile", "wink", "sunny", "blush", "new"]);
              }

              const options = tagSearch(term);

              return resolve(options);
            })
              .then((list) => {
                if (list === SKIP) {
                  return;
                }
                return list.map((code) => ({ code }));
              })
              .then((list) => {
                if (list?.length) {
                  list.push({ label: I18n.t("composer.more_emoji"), term });
                }
                return list;
              });
          },
        });
      }
    });
  },
};
