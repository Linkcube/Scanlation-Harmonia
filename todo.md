## notes
x Save/load

## Dialogue boxes on the image
x Move
x Scale
x Bind to existing dialogues
x Save/load

## Styles
x Create backend reader/writer
x UI create/edit/delete
x Load list to display in dialogues
- Have unified styling

## Import
x Have an import option for page images
x Import chapters
- Smarter import (raw->raw, clean->clean, etc)

## Delete dialog
x Confirm deletes, also move the delete page button our of the way (flex-end?)

## Regex
x Have a flag to hide regex elements

## Page canvas
x Have dialogue boxes on the page

## TS view
- Have alt view for non-TL

## Export
- Need completion progress displays
x Grab only final images and copy to new folder
    + Should be able to specify output params for compatibility (i.e. mangadex)

## Series tree
x Have collapse/min option for vol/chapter
x May require rewrite..

## Autosave
x Dialogue text as well as box placement
x Hopefully remove the save button all-together

## Multiple target languages for translation
x Select options for dialogue boxes
x Select option for finished picture
x Keep language setting in the series config

## Scalable pic (on hold)
- Allow the user to scale the selected image/dialogue boxes
- Also have enlarged modal view?

## Larger display targets
~ Have contents re-arrange themselves for wider windows (flex-wrap)
~ Impove usability on wider windows.


## Testing notes
x Allow for hitting enter in text fields to = clicking the related button (i.e. add series)
? Allow for right clicking on the series list to delete objects
~ Allow for centering/better layout
~ View all items if possible
    + Probably move selected dialogue beneath dialogue selection, and have dialogue table scroll
x Make the dialogue scaling more noticable (corner icons)
? Maybe foreward/backward browser actions
x Page to page navigation
    + Click on Page # header and have it have dropdown of other pages
    + Arrow nav around the page header as well
x Create vol/chapter/page 1 on series creation

## Icons
x Convert to icons to save space
x Style to make better use of icons

## Changeable export folder
x Allow the user to change the folder
~ Verify contents before displaying (config.json)

## Redesign backend
- Differentiate titles and actual file names
- Allow for changing a volume/chapter/page #
- Be able to set a full series/volume/chapter name
- Make sure everything is safe for fs use from user inputs
- Combine queries/mutations to reduce endpoints
- change which data is sent in preview/full
    + make it more efficeint
    + If components allow for more data to be previewed then include it

## Testing notes 2
x Make the set folder more noticable on change/failure
    + Specify that it should be in it's own scanlation folder as it generates files
x Filter import to exclude non-image files
- right clicking on things (more delete options etc)

## Usage notes
x Add dialogue button too far away from the image
    + maybe above the image?
- Would be nice to have image expanded and be able to type into dialogue boxes at the same time
-

## Online shared service
- User firepad-esc tech to handle multiple users editing the same file
- May require changing how dialogues are handled