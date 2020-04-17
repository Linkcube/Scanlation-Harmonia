import {
    writable
} from 'svelte/store';
import fetchGraphQL from 'fetch-graphql';

export const pageMode = writable("series-select");
export const navOpen = writable(true);
export const viewMode = writable("series");
export const currentSeries = writable(null);
export const currentVolume = writable(null);
export const currentChapter = writable({});
export const currentPage = writable({});
export const seriesList = writable({});
export const seriesTree = writable({});
export const pageData = writable({});
export const pageDialogue = writable({});
export const currentDialogue = writable(-1);
export const dialogueBubble = writable({});
export const seriesStyles = writable([]);

export const graphqlBase = 'http://localhost:4000';

const graphqlUrl = `${graphqlBase}/graphql`;
const seriesListQuery = `
query {
    series {
        title,
        volumes,
        chapters,
        cover
    }
}`;

const seriesTreeQuery = (series) => `
query {
    seriesTree(series: "${series}") {
        id,
        title,
        chapters {
            id,
            title,
            pages {
                id
            }
        }
    }
}`;

const pageDataQuery = (series, volume, chapter, page) => `
query {
    page(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}", page: "Page ${page}") {
        sources {
            raw,
            clean,
            redraw,
            full,
        },
        dialogue {
            title,
            bubble {
                x
                y
                width
                height
            }
        }
    }
}`;

const pageDialogueQuery = (series, volume, chapter, page, dialogue) => `
query {
    pageDialogue(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}", page: "Page ${page}", dialogue: ${dialogue}) {
        title,
        style,
        raw,
        translated
    }
}`;

const addDialogueMutation = (series, volume, chapter, page) => `
mutation {
    addDialogue(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}", page: "Page ${page}")
}`;

const saveDialogueMutation = (series, volume, chapter, page, index, title, style, raw, translated, bubble) => `
mutation {
    saveDialogue(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}", page: "Page ${page}", index: ${index}, title: "${title}", style: ${style}, raw: """${raw}""", translated: """${translated}""", bubble: {x: ${bubble.x}, y: ${bubble.y}, width: ${bubble.width}, height: ${bubble.height}})
}`;

const deleteDialogueMutation = (series, volume, chapter, page, index) => `
mutation {
    deleteDialogue(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}", page: "Page ${page}", index: ${index})
}`;

const addPageMutation = (series, volume, chapter) => `
mutation {
    addPage(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}")
}`;

const addChapterMutation = (series, volume) => `
mutation {
    addChapter(series: "${series}", volume: "Volume ${volume}")
}`;

const addVolumeMutation = (series) => `
mutation {
    addVolume(series: "${series}")
}`;

const addSeriesMutation = (series) => `
mutation {
    addSeries(series: "${series}")
}`;

const deletePageMutation = (series, volume, chapter, page) => `
mutation {
    deletePage(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}", page: "Page ${page}")
}`;

const deleteChapterMutation = (series, volume, chapter) => `
mutation {
    deleteChapter(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}")
}`;

const deleteVolumeMutation = (series, volume) => `
mutation {
    deleteVolume(series: "${series}", volume: "Volume ${volume}")
}`;

const deleteSeriesMutation = (series) => `
mutation {
    deleteSeries(series: "${series}")
}`;

const getStylesQuery = (series) => `
query {
    getStyles(series: "${series}") {
        title,
        attributes
      }
}`;

const addStyleMutation = (series) => `
mutation {
    addStyle(series: "${series}")
}`;

const editStyleMutation = (series, index, title, attributes) => `
mutation {
    editStyle(series: "${series}", index: ${index}, title: "${title}", attributes: "${attributes}")
}`;

const deleteStyleMutation = (series, index) => `
mutation {
    deleteStyle(series: "${series}", index: ${index})
}`

const openFolderQuery = (series, volume, chapter, page) => {
    let paramString = `series: "${series}"`;
    if (volume !== undefined) {
        paramString += `, volume: "Volume ${volume}"`;
        if (chapter !== undefined) {
            paramString += `, chapter: "Chapter ${chapter}"`;
            if (page !== undefined) {
                paramString += `, page: "Page ${page}"`;
            }
        }
    }
    return `
    query {
        openFolder(${paramString})
    }`;
};

const getNotesQuery = (series, volume, chapter, page) => {
    let paramString = `series: "${series}"`;
    if (volume !== undefined) {
        paramString += `, volume: "Volume ${volume}"`;
        if (chapter !== undefined) {
            paramString += `, chapter: "Chapter ${chapter}"`;
            if (page !== undefined) {
                paramString += `, page: "Page ${page}"`;
            }
        }
    }
    return `
    query {
        getNotes(${paramString})
    }`;
};

const saveNotesMutation = (notes, series, volume, chapter, page) => {
    let paramString = `series: "${series}"`;
    if (volume !== undefined) {
        paramString += `, volume: "Volume ${volume}"`;
        if (chapter !== undefined) {
            paramString += `, chapter: "Chapter ${chapter}"`;
            if (page !== undefined) {
                paramString += `, page: "Page ${page}"`;
            }
        }
    }
    paramString += `, notes: """${notes}"""`;
    return `
    mutation {
        saveNotes(${paramString})
    }`;
}

const getExportFolderQuery = `
query {
    getExportFolder
}`;

const setExportFolderMutation = (newFolder) => `
mutation {
    setExportFolder(newFolder: """${newFolder}""")
}`;

export function fetchSeries() {
    seriesList.set(fetchGraphQL(
        graphqlUrl, {},
        seriesListQuery
    ));
};

export function fetchSeriesTree(series) {
    seriesTree.set(fetchGraphQL(
        graphqlUrl, {},
        seriesTreeQuery(series)
    ));
};

export function fetchPageData(series, volume, chapter, page) {
    pageData.set(fetchGraphQL(
        graphqlUrl, {},
        pageDataQuery(series, volume, chapter, page)
    ));
};

export function fetchPageDialogue(series, volume, chapter, page, dialogue) {
    currentDialogue.set(dialogue);
    pageDialogue.set(fetchGraphQL(
        graphqlUrl, {},
        pageDialogueQuery(series, volume, chapter, page, dialogue)
    ));
};

export function fetchAddDialogue(series, volume, chapter, page) {
    return fetchGraphQL(
        graphqlUrl, {},
        addDialogueMutation(series, volume, chapter, page)
    );
}

export function fetchSaveDialogue(series, volume, chapter, page, index, title, style, raw, translated, bubble) {
    if (bubble === null) {
        console.log(`Dialogue ${index} has a null bubble!!`);
        return Promise.resolve();
    }
    return fetchGraphQL(
        graphqlUrl, {},
        saveDialogueMutation(series, volume, chapter, page, index, title, style, raw, translated, bubble)
    );
}

export function fetchDeleteDialogue(series, volume, chapter, page, index) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteDialogueMutation(series, volume, chapter, page, index)
    );
}

export function fetchAddPage(series, volume, chapter) {
    return fetchGraphQL(
        graphqlUrl, {},
        addPageMutation(series, volume, chapter)
    );
}

export function fetchAddChapter(series, volume) {
    return fetchGraphQL(
        graphqlUrl, {},
        addChapterMutation(series, volume)
    );
}

export function fetchAddVolume(series) {
    return fetchGraphQL(
        graphqlUrl, {},
        addVolumeMutation(series)
    );
}

export function fetchAddSeries(series) {
    return fetchGraphQL(
        graphqlUrl, {},
        addSeriesMutation(series)
    );
}

export function fetchDeletePage(series, volume, chapter, page) {
    return fetchGraphQL(
        graphqlUrl, {},
        deletePageMutation(series, volume, chapter, page)
    );
}

export function fetchDeleteChapter(series, volume, chapter) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteChapterMutation(series, volume, chapter)
    );
}

export function fetchDeleteVolume(series, volume) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteVolumeMutation(series, volume)
    );
}

export function fetchDeleteSeries(series) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteSeriesMutation(series)
    );
}

export function fetchGetNotes(series, volume, chapter, page) {
    return fetchGraphQL(
        graphqlUrl, {},
        getNotesQuery(series, volume, chapter, page)
    );
}

export function fetchSaveNotes(notes, series, volume, chapter, page) {
    return fetchGraphQL(
        graphqlUrl, {},
        saveNotesMutation(notes, series, volume, chapter, page)
    );
}

export function fetchGetStyles(series) {
    seriesStyles.set(fetchGraphQL(
        graphqlUrl, {},
        getStylesQuery(series)
    ));
}

export function fetchAddStyle(series) {
    return fetchGraphQL(
        graphqlUrl, {},
        addStyleMutation(series)
    );
}

export function fetchEditStyle(series, index, title, attributes) {
    return fetchGraphQL(
        graphqlUrl, {},
        editStyleMutation(series, index, title, attributes)
    );
}

export function fetchDeleteStyle(series, index) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteStyleMutation(series, index)
    );
}

export function fetchOpenFolder(series, volume, chapter, page) {
    return fetchGraphQL(
        graphqlUrl, {},
        openFolderQuery(series, volume, chapter, page)
    );
}

export function fetchGetExportFolder() {
    return fetchGraphQL(
        graphqlUrl, {},
        getExportFolderQuery
    );
}

export function fetchSetExportFolder(newFolder) {
    return fetchGraphQL(
        graphqlUrl, {},
        setExportFolderMutation(newFolder)
    );
}