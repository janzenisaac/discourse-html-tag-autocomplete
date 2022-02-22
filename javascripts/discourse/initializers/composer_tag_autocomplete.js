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

      const template = function (params) {
        const options = params.options;
        let html = "<div class='autocomplete'>";

        html += "<ul>";
        options.forEach((a) => {
          html += `<li><a href title="${a.code}">`;
          html += `<span class='username'>${a.code}</span>`;
          html += `</a></li>`;
        });
        html += "</ul>";

        html += "</div>";

        return new Handlebars.SafeString(html).string;
      };

      function testFn(textarea) {
        chat._$textarea = $(textarea);
        chat._$textarea.autocomplete({
          template: template,
          key: "<",
          afterComplete: (text) => {
            chat._$textarea.val(text);
            // wtf do i do here
            chat._focusTextArea();
          },
          treatAsTextarea: true,
          transformComplete: (v) => {
            if (v.code) {
              return `${v.code}></${v.code}>`;
            } else {
              $(textarea).autocomplete({ cancel: true });
              return "";
            }
          },
          dataSource: (term) => {
            return new Promise((resolve) => {
              const full = `${term}`;
              term = term.toLowerCase();

              if (term === "") {
                return resolve(["s", "smile", "wink", "sunny", "blush"]);
              }

              const options = tagSearch(term, {
                maxResults: 5,
              });

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
