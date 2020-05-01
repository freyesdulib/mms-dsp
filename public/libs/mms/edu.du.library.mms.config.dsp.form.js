$(function() {

  var dspRecordFields = {
    "titleSet": {
        "label": "Title",
        "element":"title",
        "id": "title",
        "type": "text",
        "vocabulary": "false",
        "repeat": "false",
        "displayOrder": 1,
        "required": "true"
    },
    "identifierSet": {
        "label": "Filename(s)",
        "element":"identifier",
        "id":"identifier",
        "type": "text",
        "vocabulary": "false",
        "repeat": "true",
        "displayOrder": 2,
        "required": "true"
    },
    "authorSet": {
        "label": "Author",
        "element":"author",
        "id": "author",
        "type": "text",
        "vocabulary": "false",
        "repeat": "true",
        "displayOrder": 3,
        "required": "false"
    },
    "isbnSet": {
        "label": "ISBN",
        "element":"isbn",
        "id": "isbn",
        "type": "text",
        "vocabulary": "false",
        "repeat": "true",
        "displayOrder": 3,
        "required": "true"
    },
      "editionStatementSet": {
          "label": "Edition Statement",
          "element":"editionstatement",
          "id": "editionstatement",
          "type": "text",
          "vocabulary": "false",
          "repeat": "false",
          "displayOrder": 4,
          "required": "false"
    },
    "publisherSet": {
        "label": "Publisher",
        "element":"publisher",
        "id":"publisher",
        "type": "text",
        "vocabulary": "false",
        "repeat": "false",
        "displayOrder": 6,
        "required": "false"
    },
    /*"dateSet": {
        "label": "Date",
        "element":"date",
        "id":"date",
        "type": "text",
        "vocabulary": "false",
        "repeat": "false",
        "displayOrder": 6,
        "required": "false"
    },*/
    "descriptionSet": {
        "label": "Description",
        "element":"description",
        "id":"description",
        "type": "textarea",
        "vocabulary": "false",
        "repeat": "false",
        "displayOrder": 7,
        "required": "false"
    },
    "languageSet": {
        "label": "Language",
        "element":"language",
        "id":"language",
        "type": "text",
        "vocabulary": "false",
        "repeat": "false",
        "displayOrder": 8,
        "required": "false"
    },
    "subjectSet": {
        "label": "Subject",
        "element":"subject",
        "id":"subject",
        "type": "text",
        "vocabulary": "true",
        "repeat": "true",
        "displayOrder": 5,
        "required": "false"
    }
  };
    sessionStorage.setItem("mms_dsp_metadata_fields", JSON.stringify(dspRecordFields));
});