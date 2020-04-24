import { join, resolve } from "path";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  Dirent,
  unlinkSync
} from "fs";
import { sync as rimrafSync } from "rimraf";
import { IDialogueBubble, IStyle, IDialogueData } from "./types";

let exportFolder = join(resolve("."), "Series");

export const updateWriterExportFolder = (newFolder: string) => {
  exportFolder = newFolder;
};

export const addDialogue = (data: {
  series: string;
  volume: string;
  chapter: string;
  page: string;
}) => {
  const pagePath = join(data.series, data.volume, data.chapter, data.page);
  const dialoguePath = join(exportFolder, pagePath, "dialogue.json");
  let dialogue: IDialogueData[] = [];
  if (existsSync(dialoguePath)) {
    dialogue = JSON.parse(readFileSync(dialoguePath, "utf-8"));
  }
  dialogue.push({
    title: `Dialogue ${dialogue.length + 1}`,
    style: 0,
    raw: "",
    translated: [""],
    bubble: {
      x: 0,
      y: 0,
      height: 40,
      width: 40
    }
  });
  writeFileSync(dialoguePath, JSON.stringify(dialogue));
  return "Done";
};

export const saveDialogue = (data: {
  series: string;
  volume: string;
  chapter: string;
  page: string;
  index: number;
  title: string;
  style: number;
  raw: string;
  translated: string[];
  bubble: IDialogueBubble;
}) => {
  const pagePath = join(data.series, data.volume, data.chapter, data.page);
  const dialoguePath = join(exportFolder, pagePath, "dialogue.json");
  const dialogueList = JSON.parse(readFileSync(dialoguePath, "utf-8"));
  dialogueList[data.index] = {
    title: data.title,
    style: data.style,
    raw: data.raw,
    translated: data.translated,
    bubble: data.bubble
  };
  writeFileSync(dialoguePath, JSON.stringify(dialogueList));
  return "Done";
};

export const deleteDialogue = (data: {
  series: string;
  volume: string;
  chapter: string;
  page: string;
  index: number;
}) => {
  const pagePath = join(data.series, data.volume, data.chapter, data.page);
  const dialoguePath = join(exportFolder, pagePath, "dialogue.json");
  const dialogueList = JSON.parse(readFileSync(dialoguePath, "utf-8"));
  dialogueList.splice(data.index, 1);
  writeFileSync(dialoguePath, JSON.stringify(dialogueList));
  return "Done";
};

export const addPage = (data: {
  series: string;
  volume: string;
  chapter: string;
}) => {
  const chapterPath = join(
    exportFolder,
    data.series,
    data.volume,
    data.chapter
  );
  let pageIndex = 1;
  let done = false;
  while (!done) {
    if (!existsSync(join(chapterPath, `Page ${pageIndex}`))) {
      mkdirSync(join(chapterPath, `Page ${pageIndex}`));
      done = true;
    }
    pageIndex += 1;
  }
  return "Done";
};

export const addChapter = (data: { series: string; volume: string }) => {
  const chapterPath = join(exportFolder, data.series, data.volume);
  let chapterIndex = 1;
  let done = false;
  while (!done) {
    if (!existsSync(join(chapterPath, `Chapter ${chapterIndex}`))) {
      mkdirSync(join(chapterPath, `Chapter ${chapterIndex}`));
      done = true;
    }
    chapterIndex += 1;
  }
  return "Done";
};

export const addVolume = (data: { series: string }) => {
  const volumePath = join(exportFolder, data.series);
  let volumeIndex = 1;
  let done = false;
  while (!done) {
    if (!existsSync(join(volumePath, `Volume ${volumeIndex}`))) {
      mkdirSync(join(volumePath, `Volume ${volumeIndex}`));
      done = true;
    }
    volumeIndex += 1;
  }
  return "Done";
};

export const addSeries = (data: { series: string }) => {
  const seriesPath = join(exportFolder, data.series);
  if (!existsSync(seriesPath)) {
    mkdirSync(seriesPath);
    mkdirSync(join(seriesPath, "Volume 1"));
    mkdirSync(join(seriesPath, "Volume 1", "Chapter 1"));
    mkdirSync(join(seriesPath, "Volume 1", "Chapter 1", "Page 1"));
  }
  addStyle(data);
  addLanguage(data);
  saveNotes({ series: data.series, notes: "" });
  return "Done";
};

export const deletePage = (data: {
  series: string;
  volume: string;
  chapter: string;
  page: string;
}) => {
  const pagePath = join(
    exportFolder,
    data.series,
    data.volume,
    data.chapter,
    data.page
  );
  if (existsSync(pagePath)) {
    rimrafSync(pagePath);
  }
  return "Done";
};

export const deleteChapter = (data: {
  series: string;
  volume: string;
  chapter: string;
}) => {
  const chapterPath = join(
    exportFolder,
    data.series,
    data.volume,
    data.chapter
  );
  if (existsSync(chapterPath)) {
    rimrafSync(chapterPath);
  }
  return "Done";
};

export const deleteVolume = (data: { series: string; volume: string }) => {
  const volumePath = join(exportFolder, data.series, data.volume);
  if (existsSync(volumePath)) {
    rimrafSync(volumePath);
  }
  return "Done";
};

export const deleteSeries = (data: { series: string }) => {
  const seriesPath = join(exportFolder, data.series);
  if (existsSync(seriesPath)) {
    rimrafSync(seriesPath);
  }
  return "Done";
};

export const saveNotes = (data: {
  series: string;
  volume?: string;
  chapter?: string;
  page?: string;
  notes: string;
}) => {
  let notePath = join(exportFolder, data.series);
  if (data.volume !== undefined) {
    notePath = join(notePath, data.volume);
    if (data.chapter !== undefined) {
      notePath = join(notePath, data.chapter);
      if (data.page !== undefined) {
        notePath = join(notePath, data.page);
      }
    }
  }
  notePath = join(notePath, "config.json");
  let title = "";
  if (existsSync(notePath)) {
    const oldConfig = JSON.parse(readFileSync(notePath, "utf-8"));
    title = oldConfig.title;
  }
  writeFileSync(notePath, JSON.stringify({ title, notes: data.notes }));
  return "Done";
};

export const addStyle = (data: { series: string }) => {
  const stylePath = join(exportFolder, data.series, "styles.json");
  let styles: IStyle[] = [];
  if (existsSync(stylePath)) {
    styles = JSON.parse(readFileSync(stylePath, "utf-8"));
  }
  styles.push({ title: "New Style", attributes: "" });
  writeFileSync(stylePath, JSON.stringify(styles));
  return "Done";
};

export const editStyle = (data: {
  series: string;
  index: number;
  title: string;
  attributes: string;
}) => {
  const stylePath = join(exportFolder, data.series, "styles.json");
  let styles: IStyle[] = [];
  if (existsSync(stylePath)) {
    styles = JSON.parse(readFileSync(stylePath, "utf-8"));
  }
  styles[data.index] = { title: data.title, attributes: data.attributes };
  writeFileSync(stylePath, JSON.stringify(styles));
  return "Done";
};

export const deleteStyle = (data: { series: string; index: number }) => {
  const stylePath = join(exportFolder, data.series, "styles.json");
  let styles: IStyle[] = [];
  if (existsSync(stylePath)) {
    styles = JSON.parse(readFileSync(stylePath, "utf-8"));
    styles.splice(data.index, 1);
    writeFileSync(stylePath, JSON.stringify(styles));
  }
  return "Done";
};

export const addLanguage = (data: { series: string }) => {
  const languagePath = join(exportFolder, data.series, "languages.json");
  let languages: IStyle[] = [];
  if (existsSync(languagePath)) {
    languages = JSON.parse(readFileSync(languagePath, "utf-8"));
  }
  languages.push({ title: "New Language", attributes: "" });
  writeFileSync(languagePath, JSON.stringify(languages));
  return "Done";
};

export const editLanguage = (data: {
  series: string;
  index: number;
  title: string;
  attributes: string;
}) => {
  const languagePath = join(exportFolder, data.series, "languages.json");
  let languages: IStyle[] = [];
  if (existsSync(languagePath)) {
    languages = JSON.parse(readFileSync(languagePath, "utf-8"));
  }
  languages[data.index] = { title: data.title, attributes: data.attributes };
  writeFileSync(languagePath, JSON.stringify(languages));
  return "Done";
};

export const deleteLanguage = (data: { series: string; index: number }) => {
  const languagePath = join(exportFolder, data.series, "languages.json");
  let languages: IStyle[] = [];
  if (existsSync(languagePath)) {
    languages = JSON.parse(readFileSync(languagePath, "utf-8"));
    languages.splice(data.index, 1);
    writeFileSync(languagePath, JSON.stringify(languages));
  }
  return "Done";
};

export const cleanPreviousPageImage = (pagePath: string, scope: string) => {
  const pageFiles: string[] = readdirSync(pagePath, { withFileTypes: true })
    .filter((file: Dirent) => file.isFile())
    .map((file: Dirent) => file.name);
  pageFiles.forEach(file => {
    if (file.includes("redraw.") && scope === "redraw") {
      unlinkSync(join(pagePath, file));
    } else if (file.includes("clean.") && scope === "clean") {
      unlinkSync(join(pagePath, file));
    } else if (file.includes("raw.") && scope === "raw") {
      unlinkSync(join(pagePath, file));
    } else if (file.includes("full.") && scope === "full") {
      unlinkSync(join(pagePath, file));
    }
  });
};

export const cleanPreviousSeriesImage = (seriesPath: string) => {
  const seriesFiles: string[] = readdirSync(seriesPath, { withFileTypes: true })
    .filter((file: Dirent) => file.isFile())
    .map((file: Dirent) => file.name);
  seriesFiles.forEach(file => {
    if (file.includes("cover.")) {
      unlinkSync(join(seriesPath, file));
    }
  });
};
