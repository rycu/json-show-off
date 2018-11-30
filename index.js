import { settings, styles } from "./config";

let inlineStyles;
let displaySettings;

// Creates the caption text above every object
const getCaption = feed => {
  const propCount = Object.keys(feed).length;
  if (Array.isArray(feed)) {
    const propLabel = propCount === 1 ? "item" : "items";
    return `<summary style='${inlineStyles.caption}'><span style='${
      inlineStyles.captionPrefix
    }'>Array</span><span style='${
      inlineStyles.captionSuffix
    }'> [${propCount} ${propLabel}]</span></summary>`;
  }
  if (typeof feed === "object") {
    const propLabel = propCount === 1 ? "property" : "properties";
    return `<summary style='${inlineStyles.caption}'><span style='${
      inlineStyles.captionPrefix
    }'>Object</span><span style='${
      inlineStyles.captionSuffix
    }'> {${propCount} ${propLabel}}</span></summary>`;
  }
  return `<summary style='${inlineStyles.caption}'>${typeof feed}</summary>`;
};

// Opening tags for tables
const getTablePrefix = feed => {
  const tableType = Array.isArray(feed) ? "array" : "object";
  return `<details style='${
    inlineStyles.details
  }' ${displaySettings.expandOnLoad && "open"}>${getCaption(
    feed
  )}<table style='${inlineStyles[tableType] + inlineStyles.table}'>`;
};
// Closing tags for tables
const tableSuffix = "</table></details>";

// creates a span value by type
const getStyledType = value => {
  if (typeof value === "string") {
    if (value.startsWith("https://") || value.startsWith("http://")) {
      if (
        (displaySettings.displayImages && value.endsWith("jpg")) ||
        value.endsWith("jepg") ||
        value.endsWith("png") ||
        value.endsWith("gif") ||
        value.endsWith("bmp")
      ) {
        return `<img style='${inlineStyles.img}' src='${value}'/>`;
      }
      if (displaySettings.displayLinks) {
        return `<a style='${
          inlineStyles.link
        }' href='${value}' target="_blank" rel="noreferrer" rel="noopener">${value}</a>`;
      }
    }
  }

  const styledTags = {
    string: `<span style='${inlineStyles.string}'>${value}</span>`,
    number: `<span style='${inlineStyles.number}'>${value}</span>`,
    boolean: `<span style='${
      value ? inlineStyles.true : inlineStyles.false
    }'>${value}</span>`,
    object: `<span style='${inlineStyles.null}'>${value}</span>`
  };

  return styledTags[typeof value];
};

// Creates new column
const getValueColumn = value =>
  `<td style='${inlineStyles.column}'>${
    /* eslint-disable no-use-before-define */
    typeof value === "object" && value !== null
      ? buildTable(value)
      : getStyledType(value)
    /* eslint-enable no-use-before-define */
  }</td>`;

// Creates Table Head
const getArrayTableHead = feed => {
  let tableHead = Object.keys(feed).length
    ? `<tr><th style='${inlineStyles.header}'></th>`
    : "";
  Object.keys(feed).forEach(child => {
    tableHead += `<th style='${inlineStyles.header}'>${child}</th>`;
  });
  return tableHead;
};

let previousTableHead;

// Creates new row
const getTableRow = (feed, child) => {
  // Arrays are handled differently by default
  if (Array.isArray(feed) && displaySettings.horizontalArrayView) {
    const tableHead = getArrayTableHead(feed[child]);

    let arrayString =
      // skip dulicate table headings
      tableHead === previousTableHead ||
      Array.isArray(feed[child]) ||
      typeof feed[child] === "string"
        ? ""
        : tableHead;
    previousTableHead = tableHead;

    arrayString += `<tr><td style='${inlineStyles.column +
      inlineStyles.key}'>${child}</td>`;

    if (typeof feed[child] !== "object") {
      // create Column for a value
      arrayString += `${getValueColumn(feed[child])}`;
    } else {
      // create Column for each value
      Object.keys(feed[child]).forEach(node => {
        arrayString += `${getValueColumn(feed[child][node])}`;
      });
    }
    arrayString += "<tr>";
    return arrayString;
  }
  // handle non arrays
  return `<tr><td style='${inlineStyles.column +
    inlineStyles.key}'>${child}</td>${getValueColumn(feed[child])}</tr>`;
};

// Creates new table
const buildTable = feed => {
  let stringzilla = getTablePrefix(feed);
  Object.keys(feed).forEach(child => {
    stringzilla += getTableRow(feed, child);
  });
  stringzilla += tableSuffix;
  previousTableHead = "";
  return stringzilla;
};

const showOff = (feed, customStyles, customSettings) => {
  // add any custom styles or settings to the defaults.
  inlineStyles = { ...styles, ...customStyles };
  displaySettings = { ...settings, ...customSettings };
  return buildTable(feed);
};

export default showOff;

// @TODO Generate Key
// @TODO url to links
// @TODO render pics
