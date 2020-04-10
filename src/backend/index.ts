import * as express from "express";
import * as express_graphql from "express-graphql";
import { resolve, join } from "path";
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
  deleteStyle
} from "./writers";

const exportFolder = join(resolve('.'), "Series");
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
  app.listen(4000, () =>
    print("Express GraphQL Server Now Running On localhost:4000/graphql")
  );
}

startService();
