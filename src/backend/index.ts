#!/usr/bin/env node

import * as express from "express";
import * as express_graphql from "express-graphql";
import * as fileUpload from "express-fileupload";
import { resolve, join, extname, format, parse } from "path";
import { SCHEMA } from "./schema";
import {
  getNotes,
  getSeries,
  getSeriesTree,
  getPageData,
  getPageDialogue,
  getStyles,
  openFolder,
  updateReaderExportFolder,
  getExportFolder,
  getLanguages
} from "./readers";
import {
  addDialogue,
  deleteDialogue,
  saveDialogue,
  addPage,
  addChapter,
  addVolume,
  addSeries,
  deletePage,
  deleteChapter,
  deleteVolume,
  deleteSeries,
  saveNotes,
  addStyle,
  editStyle,
  deleteStyle,
  cleanPreviousPageImage,
  cleanPreviousSeriesImage,
  updateWriterExportFolder,
  addLanguage,
  editLanguage,
  deleteLanguage,
  exportChapter
} from "./writers";
import { existsSync, mkdirSync, mkdir } from "fs";

let exportFolder = join(resolve("."), "Series");

const setExportFolder = (data: { newFolder: string }) => {
  let parsedPath: string;
  if (data.newFolder === "") {
    parsedPath = format(parse("."));
  } else {
    parsedPath = format(parse(data.newFolder));
  }
  mkdir(parsedPath, err => {
    if (err && err.code !== "EEXIST") {
      console.log(err);
      return "Failed";
    }
    exportFolder = parsedPath;
    app.use(express.static(resolve(parsedPath)));
    updateReaderExportFolder(parsedPath);
    updateWriterExportFolder(parsedPath);
    return "Done";
  });
};

const cors = require("cors");
let app: any;

const root = {
  series: getSeries,
  getNotes,
  seriesTree: getSeriesTree,
  page: getPageData,
  pageDialogue: getPageDialogue,
  addDialogue,
  saveDialogue,
  deleteDialogue,
  addPage,
  addChapter,
  addVolume,
  addSeries,
  deletePage,
  deleteChapter,
  deleteVolume,
  deleteSeries,
  saveNotes,
  getStyles,
  addStyle,
  editStyle,
  deleteStyle,
  openFolder,
  getExportFolder,
  setExportFolder,
  getLanguages,
  addLanguage,
  editLanguage,
  deleteLanguage,
  exportChapter
};

function print(msg: string) {
  console.log(msg);
}

function startService() {
  app = express();
  app.use(cors()); // For graphql over http
  app.use(
    "/graphql",
    express_graphql({
      graphiql: true,
      rootValue: root,
      schema: SCHEMA
    })
  );
  app.use(express.static(resolve(exportFolder)));
  app.use(fileUpload());
  app.post("/uploadPageImage", (req: any, res: any) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded");
    }

    if (!req.body.pageData) {
      return res.status(400).send("No page data was uploaded");
    }

    const image = req.files.image;
    const pageData = JSON.parse(req.body.pageData);
    const pagePath = join(
      exportFolder,
      pageData.series,
      pageData.volume,
      pageData.chapter,
      pageData.page
    );

    cleanPreviousPageImage(pagePath, pageData.image);

    image.mv(
      join(pagePath, pageData.image + extname(image.name)),
      (err: Error) => {
        if (err) return res.status(500).send(err);

        res.send("File uploaded!");
      }
    );
  });
  app.post("/uploadChapter", (req: any, res: any) => {
    if (!req.body.chapterData) {
      return res.status(400).send("No page data was uploaded");
    }
    const chapterData = JSON.parse(req.body.chapterData);
    const chapterPath = join(
      exportFolder,
      chapterData.series,
      chapterData.volume,
      chapterData.chapter
    );
    let pageIndex = 1;
    Array.from(req.files.files).forEach((element: any) => {
      let done = false;
      while (!done) {
        if (!existsSync(join(chapterPath, `Page ${pageIndex}`))) {
          mkdirSync(join(chapterPath, `Page ${pageIndex}`));
          element.mv(
            join(
              chapterPath,
              `Page ${pageIndex}`,
              "raw" + extname(element.name)
            ),
            (err: Error) => {
              if (err) return res.status(500).send(err);
            }
          );
          done = true;
        }
        pageIndex += 1;
      }
    });
    res.send("Chapter imported!");
  });
  app.post("/uploadSeriesImage", (req: any, res: any) => {
    if (!req.body.series) {
      return res.status(400).send("No series data was uploaded");
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded");
    }
    const image = req.files.image;
    const seriesPath = join(exportFolder, JSON.parse(req.body.series));
    const coverPath = join(seriesPath, "cover" + extname(image.name));

    cleanPreviousSeriesImage(seriesPath);

    image.mv(coverPath, (err: Error) => {
      if (err) return res.status(500).send(err);

      res.send("Cover uploaded!");
    });
  });
  app.listen(4000, () =>
    print("Express GraphQL Server Now Running On localhost:4000/graphql")
  );
}

startService();
