import { join, resolve } from "path";
import {
  ISeriesConfig,
  IPageData,
  ISeriesTreeNode,
  IDialogueData,
  IStyle
} from "./types";
import {
  readdirSync,
  Dirent,
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync
} from "fs";
import { last } from "lodash";
import * as open from "open";

let exportFolder = join(resolve("."), "Series");

export const updateReaderExportFolder = (newFolder: string) => {
  exportFolder = newFolder;
};

export const getSeries = () => {
  const configs: ISeriesConfig[] = [];
  if (!existsSync(exportFolder)) {
    mkdirSync(exportFolder);
    return configs;
  }
  const dirs: string[] = readdirSync(exportFolder, { withFileTypes: true })
    .filter(
      (file: Dirent) =>
        file.isDirectory() &&
        existsSync(join(exportFolder, file.name, "config.json"))
    )
    .map((dir: Dirent) => dir.name);
  dirs.forEach(dir => {
    const volumes = readdirSync(join(exportFolder, dir), {
      withFileTypes: true
    })
      .filter((file: Dirent) => file.isDirectory() && file.name !== "export")
      .map((folder: Dirent) => folder.name);
    let chapters = 0;
    volumes.forEach(volume => {
      readdirSync(join(exportFolder, dir, volume), { withFileTypes: true })
        .filter(
          (file: Dirent) => file.isDirectory() && file.name.includes("Chapter")
        )
        .forEach(() => (chapters += 1));
    });
    const cover = readdirSync(join(exportFolder, dir), { withFileTypes: true })
      .filter((file: Dirent) => file.isFile() && file.name.includes("cover."))
      .map((file: Dirent) => join(dir, file.name))[0];

    const config = { title: dir, volumes: volumes.length, chapters, cover };
    configs.push(config);
  });
  return configs;
};

export const getNotes = (data: {
  series: string;
  volume?: string;
  chapter?: string;
  page?: string;
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
  if (!existsSync(notePath)) {
    const baseConfig = {
      title: "",
      notes: ""
    };
    writeFileSync(notePath, JSON.stringify(baseConfig), "utf-8");
    return baseConfig;
  }
  return JSON.parse(readFileSync(notePath, "utf-8")).notes;
};

export const getPageData = (data: {
  series: string;
  volume: string;
  chapter: string;
  page: string;
}) => {
  const pagePath = join(data.series, data.volume, data.chapter, data.page);
  const pageFiles: string[] = readdirSync(join(exportFolder, pagePath), {
    withFileTypes: true
  })
    .filter((file: Dirent) => file.isFile())
    .map((file: Dirent) => file.name);
  const page: IPageData = {
    sources: {
      raw: undefined,
      clean: undefined,
      redraw: undefined,
      full: undefined
    },
    dialogue: []
  };
  pageFiles.forEach(file => {
    if (file.includes("redraw.")) {
      page.sources.redraw = join(pagePath, file);
    } else if (file.includes("clean.")) {
      page.sources.clean = join(pagePath, file);
    } else if (file.includes("raw.")) {
      page.sources.raw = join(pagePath, file);
    } else if (file.includes("full.")) {
      page.sources.full = join(pagePath, file);
    }
  });
  if (existsSync(join(exportFolder, pagePath, "dialogue.json"))) {
    page.dialogue = JSON.parse(
      readFileSync(join(exportFolder, pagePath, "dialogue.json"), "utf-8")
    ).map((dialogue: IDialogueData) => {
      return { title: dialogue.title, bubble: dialogue.bubble };
    });
  }
  return page;
};

export const getPageDialogue = (data: {
  series: string;
  volume: string;
  chapter: string;
  page: string;
  dialogue: number;
}) => {
  const pagePath = join(data.series, data.volume, data.chapter, data.page);
  const dialoguePath = join(exportFolder, pagePath, "dialogue.json");
  if (existsSync(dialoguePath)) {
    return JSON.parse(
      readFileSync(join(exportFolder, pagePath, "dialogue.json"), "utf-8")
    )[data.dialogue];
  }
  return;
};

export const getSeriesTree = (data: { series: string }) => {
  const items: ISeriesTreeNode[] = [];
  const volumes: string[] = readdirSync(join(exportFolder, data.series), {
    withFileTypes: true
  })
    .filter((file: Dirent) => file.isDirectory())
    .map((dir: Dirent) => dir.name);
  volumes.forEach(volume => {
    const volumeChapters: ISeriesTreeNode[] = [];
    const chapters: string[] = readdirSync(
      join(exportFolder, data.series, volume),
      { withFileTypes: true }
    )
      .filter((file: Dirent) => file.isDirectory())
      .map((dir: Dirent) => dir.name);
    chapters.forEach(chapter => {
      const chapterPages: ISeriesTreeNode[] = [];
      const pages: string[] = readdirSync(
        join(exportFolder, data.series, volume, chapter),
        { withFileTypes: true }
      )
        .filter((file: Dirent) => file.isDirectory())
        .map((dir: Dirent) => dir.name);
      pages.forEach(page => {
        chapterPages.push({
          id: last(page.split(" "))
        });
      });
      let chapterTitle = "";
      const chapterConfig = join(
        exportFolder,
        data.series,
        volume,
        chapter,
        "config.json"
      );
      if (existsSync(chapterConfig)) {
        chapterTitle = JSON.parse(readFileSync(chapterConfig, "utf-8")).title;
      }
      chapterPages.sort((a: ISeriesTreeNode, b: ISeriesTreeNode) => {
        if (a.id && b.id) {
          if (Number(a.id) > Number(b.id)) return 1;
          return -1;
        }
        return 0;
      });
      volumeChapters.push({
        id: last(chapter.split(" ")),
        title: chapterTitle,
        pages: chapterPages
      });
    });
    let volumeTitle = "";
    const volumeConfig = join(exportFolder, data.series, volume, "config.json");
    if (existsSync(volumeConfig)) {
      volumeTitle = JSON.parse(readFileSync(volumeConfig, "utf-8")).title;
    }
    volumeChapters.sort((a: ISeriesTreeNode, b: ISeriesTreeNode) => {
      if (a.id && b.id) {
        if (Number(a.id) > Number(b.id)) return 1;
        return -1;
      }
      return 0;
    });
    items.push({
      id: last(volume.split(" ")),
      title: volumeTitle,
      chapters: volumeChapters
    });
  });
  return items;
};

export const getStyles = (data: { series: string }) => {
  const stylePath = join(exportFolder, data.series, "styles.json");
  let styles: IStyle[] = [];
  if (existsSync(stylePath)) {
    styles = JSON.parse(readFileSync(stylePath, "utf-8"));
  }
  return styles;
};

export const getLanguages = (data: { series: string }) => {
  const languagePath = join(exportFolder, data.series, "languages.json");
  let languages: IStyle[] = [];
  if (existsSync(languagePath)) {
    languages = JSON.parse(readFileSync(languagePath, "utf-8"));
  }
  return languages;
};

export const openFolder = (data: {
  series: string;
  volume?: string;
  chapter?: string;
  page?: string;
}) => {
  let dirPath = join(exportFolder, data.series);
  if (data.volume !== undefined) {
    dirPath = join(dirPath, data.volume);
    if (data.chapter !== undefined) {
      dirPath = join(dirPath, data.chapter);
      if (data.page !== undefined) {
        dirPath = join(dirPath, data.page);
      }
    }
  }
  if (existsSync(dirPath)) open(dirPath);
  return "Done";
};

export const getExportFolder = () => {
  return exportFolder;
};
