export interface DialogBase {
  component?: string;
  title?: string;
  dialogCaption?: string;
  dialogIntro?: string;
  dialogInfo?: string;
  submenuTitle?: string;
  items?: DialogBase[];
  submitUrl?: string;
  saveAndNext?: string;
  saveAndNextData?: string;
}

export interface MainMenu {
  menuTitle: string;
  items: DialogBase[]
}