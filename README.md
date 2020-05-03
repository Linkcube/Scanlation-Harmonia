![SH logo](https://github.com/Linkcube/Scanlation-Harmonia/tree/master/public/static/logo_alpha2_circle_sm.png "Logo")

# Scanlation Harmonia

*Very* WIP scanlation management app, meant to let you keep track of translations, styling, and progress. So far this is mostly aimed at the translator, but further in development I'm planning on making it more accesible to the TS, PR, and other members of the team.


## Installation

### Executable
You can find a list of releases with several exe's for each platform [here](https://github.com/Linkcube/Scanlation-Harmonia/releases)


### From source
Clone this repo to your computer, and run `npm install` and then `npm run start` and you're good to go (opens by default on port 5000). 

## Usage

By default the program will make a `series` folder in the same folder the application is run in, this is where all of the page/dialogue data will be stored. In the future this will be change-able but for now it is locked to this position.

When creating a series, the program will add in a volume, chapter, and page to show how the app is structured. The idea for this is to have styles/languages managed at the series level, while text/dialogue box positions are managed at the page level.

### Page Level

On the page view, you have the most amount of options, as this is the main focus of this project

- Change which image you are viewing (raw/clean/redraw/full)

   You can set/change the current image via "upload".
- Add dialogues

   Which have their own title, style, language, raw, and translated fields.

   There is also a box that will appear on the page image for each dialogue that the user can move/scale to match the text on the page.

### Chapter Level

This is mostly for managing the pages, the volume level is the same but without the following.

- Import multiple pages

   This will grab a folder full of iamge files, and import each one as a new page for the chapter.
- Export chapter

   This will grab the highest level page image (full > redraw > clean > raw) and copy them into a new folder, which will be opened afterwards.

### Series Level
- Dialogue style and language configurations

## Status

Barely an MVP at the moment, there are several new features/rewrites planned for this in the future. Currently this is just a local app that requires a team to use some other program to keep synced (I'd recommend git or the like), in the future it would be nice to have this hosted on a server in some way.

## Thank you for using Scanlation Harmonia
If you did use this in your project, please add one of the logos from `public/Static` as well as a link to this project in your work.