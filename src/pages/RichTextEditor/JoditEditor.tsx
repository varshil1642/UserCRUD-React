import JoditEditor, { Jodit } from "jodit-react";
import { useEffect, useState } from "react";
import { SelectDropdown } from "./../../shared/formik-components/FormikComponents";
import ReactDOMServer from "react-dom/server";

const List = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const extraBtnOld = {
  name: "Select Day",
  list: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  childTemplate: (editor: any, key: string, value: string) => {
    return `<span>${key}</span>`;
  },
  exec: function (editor: any, t: any, { control }: any) {
    const value = control.args && control.args[0];
    if (value) {
      editor.selection.insertHTML(value);
    } else {
      return false;
    }
  },
};

const extraBtn = {
  id: "extraBtn",
  name: "Select",
  label: "select",
  popup: (editor: any, current: any, self: any, close: any) => {
    var selectDropdown = document.createElement("select");
    selectDropdown.id = "selectDropdown";
    function addOption(text: string, value: string) {
      var option = document.createElement("option");
      option.innerText = text;
      option.setAttribute("value", value);
      option.value = value;
      selectDropdown.appendChild(option);
    }
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    addOption("Zoo", "Zoo");
    selectDropdown.onclick = function (e) {
      //the select will get focus , editor will lost focus
      e.stopPropagation(); //prevent editor get focus automatically
    };
    selectDropdown.onchange = function () {
      var option = selectDropdown.options[selectDropdown.selectedIndex];
      var val = option.value;
      selectDropdown.selectedIndex = 0;
      editor.s.insertHTML(val);
    };
    selectDropdown.setAttribute("onclick", "initializeSelect2()");
    //($(selectDropdown) as any).select2();

    console.log(selectDropdown.outerHTML);
    return selectDropdown.outerHTML;
  },
};

const extraBtnTemplate = {
  popup: (editor: any, current: any, self: any, close: any) => {
    var selectDropdown = document.createElement("select");
    selectDropdown.id = "selectDropdown";
    function addOption(text: string, value: string) {
      var option = document.createElement("option");
      option.innerText = text;
      option.setAttribute("value", value);
      option.value = value;
      selectDropdown.appendChild(option);
    }
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    List.map((day) => addOption(day, day));
    addOption("Zoo", "Zoo");
    selectDropdown.onclick = function (e) {
      //the select will get focus , editor will lost focus
      e.stopPropagation(); //prevent editor get focus automatically
    };

    selectDropdown.setAttribute("onclick", "initializeSelect2()");
    //selectDropdown.setAttribute("onchange", `handleChange(${editor})`);
    //($(selectDropdown) as any).select2();

    console.log(selectDropdown.outerHTML);
    return selectDropdown.outerHTML;
  },
};

const defaultConfig = {
  height: 500,
  buttons: [
    "extraBtn",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "ul",
    "ol",
    "|",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "video",
    "table",
    "link",
    "|",
    "align",
    "undo",
    "redo",
    "|",
    "hr",
    "eraser",
    "copyformat",
  ] as string[] | object[],
};

const Editor = () => {
  const [value, setValue] = useState("Day:");

  useEffect(() => {
    Jodit.defaultOptions.controls.extraBtn = {
      template: (editor: any, current: any) => {
        var selectDropdown = document.createElement("select");
        selectDropdown.id = "selectDropdown";

        function addOption(text: string | null, value: string | null) {
          var option = document.createElement("option");
          if (text && value) {
            option.innerText = text;
            option.setAttribute("value", value);
            option.value = value;
          }
          selectDropdown.appendChild(option);
        }
        addOption(null, null);
        List.map((day) => addOption(day, day));
        addOption("Zoo", "Zoo");

        selectDropdown.setAttribute("onchange", "handleSelectChange(this)");

        selectDropdown.style.display = "none";
        return selectDropdown.outerHTML;
      },
      exec: () => {},
    };

    class extraBtnPlugin {
      buttons = { name: "extraBtn" };
    }

    const joditConfig = {
      ...defaultConfig,
      cursorAfterAutofocus: "start",
      // showCharsCounter: false,
      // showWordsCounter: false,
      //showXPathInStatusbar: false,
      showPlaceholder: false,
      addNewLine: false,
    };

    Jodit.plugins.add("extraBtn", extraBtnPlugin);
    (window as any).editor = Jodit.make("#txtEditor", joditConfig);
  }, []);

  return (
    <>
      <textarea id="txtEditor" style={{ display: "none" }}></textarea>
      {/* <JoditEditor value={value} config={defaultConfig}></JoditEditor> */}
    </>
  );
};

export default Editor;
