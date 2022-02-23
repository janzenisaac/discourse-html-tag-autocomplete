import { withPluginApi } from "discourse/lib/plugin-api";
import { findRawTemplate } from "discourse-common/lib/raw-templates";
import { SKIP } from "discourse/lib/autocomplete";
import TextareaTextManipulation from "discourse/mixins/textarea-text-manipulation";
import { getRegister } from "discourse-common/lib/get-owner";
import { htmlTagSearch } from "../lib/html-tag-search";

export default {
  name: "discourse-html-tag-autocomplete",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      const chat = api.container.lookup("service:chat");

      if (chat) {
        chat.addAutocompleteFn(testFn);
      }

      let term;
      function testFn(composer) {
        const textarea = $(composer._textarea);
        textarea.autocomplete({
          template: findRawTemplate("html-tag-autocomplete"),
          key: "<",
          afterComplete: (text) => {
            composer.set("value", text);
            composer._focusTextArea();
            let selection = composer.getSelected();
            composer.selectText(selection.pre.length - term.length - 4, 0);
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
                return resolve([
                  "strike",
                  "kbd",
                  "b",
                  "em",
                  "mark",
                  "small",
                ]);
              }

              const options = htmlTagSearch(term);

              return resolve(options);
            }).then((list) => {
              if (list === SKIP) {
                return;
              }
              return list.map((code) => ({ code }));
            });
          },
        });
      }
    });
  },
};
