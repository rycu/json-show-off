import { settings, styles } from "./config";

const getCaption = feed => {
  const propCount = Object.keys(feed).length;
  if (Array.isArray(feed)) {
    const propLabel = propCount === 1 ? "item" : "items";
    return `<summary style='${styles.caption}'><span style='${
      styles.captionPrefix
    }'>Array</span><span style='${
      styles.captionSuffix
    }'> [${propCount} ${propLabel}]</span></summary>`;
  }
  if (typeof feed === "object") {
    const propLabel = propCount === 1 ? "property" : "properties";
    return `<summary style='${styles.caption}'><span style='${
      styles.captionPrefix
    }'>Object</span><span style='${
      styles.captionSuffix
    }'> {${propCount} ${propLabel}}</span></summary>`;
  }
  return `<summary style='${styles.caption}'>${typeof feed}</summary>`;
};

const getTablePrefix = feed => {
  const tableType = Array.isArray(feed) ? "array" : "object";
  return `<details style='${styles.details}' ${settings.expandOnLoad &&
    "open"}>${getCaption(feed)}<table style='${styles[tableType] +
    styles.table}'>`;
};
const tableSuffix = "</table></details";

const getStyledType = value => {
  const styledTags = {
    string: `<span style='${styles.string}'>${value}</span>`,
    number: `<span style='${styles.number}'>${value}</span>`,
    boolean: `<span style='${
      value ? styles.true : styles.false
    }'>${value}</span>`
  };
  return styledTags[typeof value];
};

const getValueColumn = value =>
  `<td style='${styles.column}'>${
    /* eslint-disable no-use-before-define */
    typeof value === "object" ? buildTable(value) : getStyledType(value)
    /* eslint-enable no-use-before-define */
  }</td>`;

const getArrayTableHead = feed => {
  let tableHead = Object.keys(feed).length
    ? `<tr><th style='${styles.header}'></th>`
    : "";
  Object.keys(feed).forEach(child => {
    tableHead += `<th style='${styles.header}'>${child}</th>`;
  });
  return tableHead;
};

let previousTableHead;

const getTableRow = (feed, child) => {
  if (Array.isArray(feed)) {
    const tableHead = getArrayTableHead(feed[child]);

    let arrayString =
      tableHead === previousTableHead ||
      Array.isArray(feed[child]) ||
      typeof feed[child] === "string"
        ? ""
        : tableHead;
    previousTableHead = tableHead;

    arrayString += `<tr><td style='${styles.column +
      styles.key}'>${child}</td>`;

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
  return `<tr><td style='${styles.column +
    styles.key}'>${child}</td>${getValueColumn(feed[child])}</tr>`;
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

export default buildTable;

// @TODO Generate Key
