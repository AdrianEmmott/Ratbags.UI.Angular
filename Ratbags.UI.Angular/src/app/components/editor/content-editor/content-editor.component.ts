import { Component, Input } from '@angular/core';
import { EditorComponent } from '@tinymce/tinymce-angular';

import { FormControl } from '@angular/forms';
import { AppConfigService } from '../../../services/app-config.service';

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.scss'
})
export class ContentEditorComponent {
  @Input() contentControl!: FormControl;
  
  tinyMCESecret = this.appConfigService.tinyMCEKey;

  // TODO work in the current theme
  readonly editorInitialisation: EditorComponent["init"] = {
    plugins: ["help"],
    //skin: "oxide", // regular
    //content_css: "default",
    //skin: "oxide-dark", // force dark
    //content_css: "dark"
    skin: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oxide-dark" : ""), // match user prefs
    content_css: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "")
  };

  constructor(private appConfigService: AppConfigService,) {
  }
}
