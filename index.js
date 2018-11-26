import { settings, styles } from "./config";

let inlineStyles;
let displaySettings;

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

const getTablePrefix = feed => {
  const tableType = Array.isArray(feed) ? "array" : "object";
  return `<details style='${
    inlineStyles.details
  }' ${displaySettings.expandOnLoad && "open"}>${getCaption(
    feed
  )}<table style='${inlineStyles[tableType] + inlineStyles.table}'>`;
};
const tableSuffix = "</table></details";

const getStyledType = value => {
  const styledTags = {
    string: `<span style='${inlineStyles.string}'>${value}</span>`,
    number: `<span style='${inlineStyles.number}'>${value}</span>`,
    boolean: `<span style='${
      value ? inlineStyles.true : inlineStyles.false
    }'>${value}</span>`
  };
  return styledTags[typeof value];
};

const getValueColumn = value =>
  `<td style='${inlineStyles.column}'>${
    /* eslint-disable no-use-before-define */
    typeof value === "object" ? buildTable(value) : getStyledType(value)
    /* eslint-enable no-use-before-define */
  }</td>`;

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

const getTableRow = (feed, child) => {
  if (Array.isArray(feed) && displaySettings.horizontalArrayView) {
    const tableHead = getArrayTableHead(feed[child]);

    let arrayString =
      tableHead === previousTableHead ||
      Array.isArray(feed[child]) ||
      typeof feed[child] === "string"
        ? ""
        : tableHead;
    previousTableHead = tableHead;

    arrayString += `<tr><td style='${inlineStyles.column +
      inlineStyles.key}'>${child}</td>`;

    if (typeof feed[child] !== "object") {
      arrayString += `${getValueColumn(feed[child])}`;
    } else {
      Object.keys(feed[child]).forEach(node => {
        arrayString += `${getValueColumn(feed[child][node])}`;
      });
    }
    arrayString += "<tr>";
    return arrayString;
  }
  return `<tr><td style='${inlineStyles.column +
    inlineStyles.key}'>${child}</td>${getValueColumn(feed[child])}</tr>`;
};

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
  inlineStyles = { ...styles, ...customStyles };
  displaySettings = { ...settings, ...customSettings };
  return buildTable(feed);
};

export default showOff;

// @TODO Generate Key
