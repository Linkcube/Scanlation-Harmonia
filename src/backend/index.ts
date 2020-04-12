#!/usr/bin/env node

import * as express from "express";
import * as express_graphql from "express-graphql";
import * as fileUpload from "express-fileupload";
import { resolve, join, extname } from "path";
import { SCHEMA } from "./schema";
import {
  getNotes,
  getSeries,
  getSeriesTree,
  getPageData,
  getPageDialogue,
  getStyles,
  openFolder
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
  cleanPreviousImage
} from "./writers";
import { rename, existsSync, unlinkSync, readdirSync, mkdirSync } from "fs";

const exportFolder = join(resolve("."), "Series");
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
  openFolder
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

    cleanPreviousImage(pagePath, pageData.image);

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
  app.listen(4000, () =>
    print("Express GraphQL Server Now Running On localhost:4000/graphql")
  );
}

startService();
