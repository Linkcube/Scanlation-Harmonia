import {
    writable, get
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
export const seriesLanguages = writable([]);
export const currentThemeIndex = writable(0);
export const currentTheme = writable({});
export const themes = writable([]);
const uuid = writable(0);

export function getUUID() {
    uuid.update(n => n + 1);
    return get(uuid);
}

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
    saveDialogue(
        series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}",
        page: "Page ${page}", index: ${index}, title: "${title}", style: ${style}, raw: """${raw}""",
        translated: ${JSON.stringify(translated)}, bubble: {x: ${bubble.x}, y: ${bubble.y},
        width: ${bubble.width}, height: ${bubble.height}}
    )
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
    editStyle(series: "${series}", index: ${index}, title: "${title}", attributes: """${attributes}""")
}`;

const deleteStyleMutation = (series, index) => `
mutation {
    deleteStyle(series: "${series}", index: ${index})
}`

const getLanguagesQuery = (series) => `
query {
    getLanguages(series: "${series}") {
        title,
        attributes
      }
}`;

const addLanguageMutation = (series) => `
mutation {
    addLanguage(series: "${series}")
}`;

const editLanguageMutation = (series, index, title, attributes) => `
mutation {
    editLanguage(series: "${series}", index: ${index}, title: "${title}", attributes: """${attributes}""")
}`;

const deleteLanguageMutation = (series, index) => `
mutation {
    deleteLanguage(series: "${series}", index: ${index})
}`;

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

const exportChapterMutation = (series, volume, chapter) => `
mutation {
    exportChapter(series: "${series}", volume: "Volume ${volume}", chapter: "Chapter ${chapter}")
}`;

const getAppThemesQuery = () => `
query {
    getAppThemes { 
        title,
        style {
            primaryColor,
            secondaryColor,
            backgroundColor,
            primaryTextColor,
            secondaryTextColor,
            highlightColor,
            focusColor,
            activeColor,
            deleteColor,
            cancelTextColor,
            cancelBackgroundColor,
            submitTextColor,
            submitBackgroundColor
        }
    }
}
`;

const addAppThemeMutation = () => `
mutation {
    addAppTheme { 
        title,
        style {
            primaryColor,
            secondaryColor,
            backgroundColor,
            primaryTextColor,
            secondaryTextColor,
            highlightColor,
            focusColor,
            activeColor,
            deleteColor,
            cancelTextColor,
            cancelBackgroundColor,
            submitTextColor,
            submitBackgroundColor
        }
    }
}
`;

const editAppThemeMutation = (themeIndex, newTheme) => `
mutation {
    editAppTheme(
        themeIndex: ${themeIndex}, newThemeTitle: "${newTheme.title}",
        newThemeStyle: {
            primaryColor: "${newTheme.style.primaryColor}",
            secondaryColor: "${newTheme.style.secondaryColor}",
            backgroundColor: "${newTheme.style.backgroundColor}",
            primaryTextColor: "${newTheme.style.primaryTextColor}",
            secondaryTextColor: "${newTheme.style.secondaryTextColor}",
            highlightColor: "${newTheme.style.highlightColor}",
            focusColor: "${newTheme.style.focusColor}",
            activeColor: "${newTheme.style.activeColor}",
            deleteColor: "${newTheme.style.deleteColor}",
            cancelTextColor: "${newTheme.style.cancelTextColor}",
            cancelBackgroundColor: "${newTheme.style.cancelBackgroundColor}",
            submitTextColor: "${newTheme.style.submitTextColor}",
            submitBackgroundColor: "${newTheme.style.submitBackgroundColor}"
        }) { 
        title,
        style {
            primaryColor,
            secondaryColor,
            backgroundColor,
            primaryTextColor,
            secondaryTextColor,
            highlightColor,
            focusColor,
            activeColor,
            deleteColor,
            cancelTextColor,
            cancelBackgroundColor,
            submitTextColor,
            submitBackgroundColor
        }
    }
}
`;

const deleteAppThemeMutation = (themeIndex) => `
mutation {
    deleteAppTheme(themeIndex: ${themeIndex}) { 
        title,
        style {
            primaryColor,
            secondaryColor,
            backgroundColor,
            primaryTextColor,
            secondaryTextColor,
            highlightColor,
            focusColor,
            activeColor,
            deleteColor,
            cancelTextColor,
            cancelBackgroundColor,
            submitTextColor,
            submitBackgroundColor
        }
    }
}
`;

export function fetchSeries() {
    seriesList.set(fetchGraphQL(
        graphqlUrl, {},
        seriesListQuery
    ));
};

export function fetchSeriesTree() {
    seriesTree.set(fetchGraphQL(
        graphqlUrl, {},
        seriesTreeQuery(get(currentSeries))
    ));
};

export function fetchPageData() {
    pageData.set(fetchGraphQL(
        graphqlUrl, {},
        pageDataQuery(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id,
            get(currentPage)
        )
    ));
};

export function fetchPageDialogue(dialogue) {
    currentDialogue.set(dialogue);
    pageDialogue.set(fetchGraphQL(
        graphqlUrl, {},
        pageDialogueQuery(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id,
            get(currentPage),
            dialogue
        )
    ));
};

export function fetchAddDialogue() {
    return fetchGraphQL(
        graphqlUrl, {},
        addDialogueMutation(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id,
            get(currentPage)
        )
    );
}

export function fetchSaveDialogue(title, style, raw, translated) {
    if (get(dialogueBubble) === null) {
        console.log(`Dialogue ${get(currentDialogue)} has a null bubble!!`);
        return Promise.resolve();
    }
    return fetchGraphQL(
        graphqlUrl, {},
        saveDialogueMutation(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id,
            get(currentPage),
            get(currentDialogue),
            title, style, raw, translated,
            get(dialogueBubble)
        )
    );
}

export function fetchDeleteDialogue() {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteDialogueMutation(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id,
            get(currentPage),
            get(currentDialogue)
        )
    );
}

export function fetchAddPage() {
    return fetchGraphQL(
        graphqlUrl, {},
        addPageMutation(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id
        )
    );
}

export function fetchAddChapter() {
    return fetchGraphQL(
        graphqlUrl, {},
        addChapterMutation(
            get(currentSeries),
            get(currentVolume)
        )
    );
}

export function fetchAddVolume() {
    return fetchGraphQL(
        graphqlUrl, {},
        addVolumeMutation(get(currentSeries))
    );
}

export function fetchAddSeries(series) {
    return fetchGraphQL(
        graphqlUrl, {},
        addSeriesMutation(series)
    );
}

export function fetchDeletePage() {
    return fetchGraphQL(
        graphqlUrl, {},
        deletePageMutation(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id,
            get(currentPage),
        )
    );
}

export function fetchDeleteChapter() {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteChapterMutation(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id
        )
    );
}

export function fetchDeleteVolume() {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteVolumeMutation(
            get(currentSeries),
            get(currentVolume)
        )
    );
}

export function fetchDeleteSeries() {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteSeriesMutation(get(currentSeries))
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

export function fetchGetStyles() {
    seriesStyles.set(fetchGraphQL(
        graphqlUrl, {},
        getStylesQuery(get(currentSeries))
    ));
}

export function fetchAddStyle() {
    return fetchGraphQL(
        graphqlUrl, {},
        addStyleMutation(get(currentSeries))
    );
}

export function fetchEditStyle(index, title, attributes) {
    return fetchGraphQL(
        graphqlUrl, {},
        editStyleMutation(get(currentSeries), index, title, attributes)
    );
}

export function fetchDeleteStyle(index) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteStyleMutation(get(currentSeries), index)
    );
}

export function fetchGetLanguages() {
    seriesLanguages.set(fetchGraphQL(
        graphqlUrl, {},
        getLanguagesQuery(get(currentSeries))
    ));
}

export function fetchAddLanguage() {
    return fetchGraphQL(
        graphqlUrl, {},
        addLanguageMutation(get(currentSeries))
    );
}

export function fetchEditLanguage(index, title, attributes) {
    return fetchGraphQL(
        graphqlUrl, {},
        editLanguageMutation(get(currentSeries), index, title, attributes)
    );
}

export function fetchDeleteLanguage(index) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteLanguageMutation(get(currentSeries), index)
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

export function fetchExportChapter() {
    return fetchGraphQL(
        graphqlUrl, {},
        exportChapterMutation(
            get(currentSeries),
            get(currentVolume),
            get(currentChapter).id
        )
    );
}

export function fetchGetAppThemes() {
    return fetchGraphQL(
        graphqlUrl, {},
        getAppThemesQuery()
    );
}

export function fetchAddAppTheme() {
    return fetchGraphQL(
        graphqlUrl, {},
        addAppThemeMutation()
    );
}

export function fetchEditAppTheme(themeIndex, theme) {
    return fetchGraphQL(
        graphqlUrl, {},
        editAppThemeMutation(themeIndex, theme)
    );
}

export function fetchDeleteAppTheme(themeIndex) {
    return fetchGraphQL(
        graphqlUrl, {},
        deleteAppThemeMutation(themeIndex)
    );
}