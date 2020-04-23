import { buildSchema } from "graphql";

export const SCHEMA = buildSchema(`
type Query {
    series: [seriesObject]
    getNotes(series: String!, volume: String, chapter: String, page: String): String
    seriesTree(series: String!): [volumeTreeObject]
    page(series: String!, volume: String!, chapter: String!, page: String!): pageData
    pageDialogue(series: String!, volume: String!, chapter: String!, page: String!, dialogue: Int!): dialogueObject
    getStyles(series: String!): [styleObject]
    getLanguages(series: String!): [styleObject]
    openFolder(series: String!, volume: String, chapter: String, page: String): String
    getExportFolder: String
},
type Mutation {
    addDialogue(series: String!, volume: String!, chapter: String!, page: String!): String
    saveDialogue(series: String!, volume: String!, chapter: String!, page: String!,
        index: Int!, title: String!, style: Int!, raw: String!, translated: [String]!,
        bubble: dialogueBubbleInput!): String
    deleteDialogue(series: String!, volume: String!, chapter: String!, page: String!, index: Int!): String
    addPage(series: String!, volume: String!, chapter: String!): String
    addChapter(series: String!, volume: String!): String
    addVolume(series: String!): String
    addSeries(series: String!): String
    deletePage(series: String!, volume: String!, chapter: String!, page: String!): String
    deleteChapter(series: String!, volume: String!, chapter: String!): String
    deleteVolume(series: String!, volume: String!): String
    deleteSeries(series: String!): String
    saveNotes(series: String!, volume: String, chapter: String, page: String, notes: String!): String
    addStyle(series: String!): String
    editStyle(series: String!, index: Int!, title: String!, attributes: String!): String
    deleteStyle(series: String!, index: Int!): String
    addLanguage(series: String!): String
    editLanguage(series: String!, index: Int!, title: String!, attributes: String!): String
    deleteLanguage(series: String!, index: Int!): String
    setExportFolder(newFolder: String!): String
},
type seriesObject {
    title: String
    volumes: Int
    chapters: Int
    cover: String
},
type noteObject {
    page: String
    chapter: String
    volume: String
    series: String
},
type volumeTreeObject {
    id: Int
    title: String
    chapters: [chapterTreeObject]
},
type chapterTreeObject {
    id: Int
    title: String
    pages: [pageTreeObject]
},
type pageTreeObject {
    id: Int
},
type pageData {
    sources: pageSources
    dialogue: [pageDialogue]
},
type pageDialogue {
    title: String
    bubble: dialogueBubble
}
type dialogueBubble {
    x: Float
    y: Float
    width: Float
    height: Float
},
input dialogueBubbleInput {
    x: Float
    y: Float
    width: Float
    height: Float
},
type pageSources {
    raw: String
    redraw: String
    clean: String
    full: String
},
type dialogueObject {
    title: String
    style: Int
    raw: String
    translated: [String]
},
type styleObject {
    title: String
    attributes: String
}
`);
