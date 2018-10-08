import { autoinject, bindable, bindingMode } from "aurelia-framework";
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/webpack-resolver'

@autoinject()
export class AceCustomElement {

  @bindable({ defaultBindingMode: bindingMode.twoWay }) public content: string;
  @bindable public readonly: boolean = false;

  private editor;

  constructor(private element: Element) {
  }

  attached() {
    let text = this.content;
    
    if (!text) {
      text = '';
    }

    this.editor = ace.edit(null, {
      maxLines: 50,
      minLines: 10,
      value: text,
      mode: "ace/mode/json",
      fontSize: "16px",
      showPrintMargin: false
    });

    this.editor.setTheme("ace/theme/monokai");
    this.editor.session.setMode("ace/mode/json");

    this.editor.on("change", e => {
      this.content = this.editor.getSession().getValue();
    });

    this.editor.setReadOnly(this.readonly);

    this.element.appendChild(this.editor.container)
  }

  readonlyChanged(newValue) {
    if (this.editor) {
      this.editor.setReadOnly(newValue);
    }
  }
}
