export interface INoteData {
  series: string;
  volume?: string;
  chapter?: string;
  page?: string;
}

export interface ISeriesConfig {
  title: string;
  volumes: number;
  chapters: number;
  cover: string;
}

export interface IPageData {
  sources: {
    raw?: string;
    clean?: string;
    redraw?: string;
    full?: string;
  };
  dialogue: IPageDialogue[];
}

export interface ISeriesTreeNode {
  id?: string;
  title?: string;
  chapters?: ISeriesTreeNode[];
  pages?: ISeriesTreeNode[];
}

export interface IDialogueData {
  title: string;
  style: number;
  raw: string;
  translated: string[];
  bubble: IDialogueBubble;
}

export interface IDialogueBubble {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IPageDialogue {
  title: string;
  bubble: IDialogueBubble;
}

export interface IStyle {
  title: string;
  attributes: string;
}

export interface ITheme {
  title: string;
  style: IThemeStyle;
}

export interface IThemeStyle {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  highlightColor: string;
  focusColor: string;
  activeColor: string;
  deleteColor: string;
  cancelTextColor: string;
  cancelBackgroundColor: string;
  submitTextColor: string;
  submitBackgroundColor: string;
}
