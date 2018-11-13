import mockFeed from "./mockFeed";

const styles = {
  table:
    "border-collapse: collapse; color:white; background-color:black; text-align:left; padding:6px;",
  column: "border:1px solid green; padding:10px;",
  caption: "font-size:smaller; text-align:centre; padding:4px 0;",
  key: "text-align:right; font-weight:bold;"
};

const getCaption = feed => {
  const propCount = Object.keys(feed).length;
  if (Array.isArray(feed)) {
    const propLabel = propCount === 1 ? "item" : "items";
    return `<summary style='${
      styles.caption
    }'>Array [${propCount} ${propLabel}]</summary>`;
  }
  if (typeof feed === "object") {
    const propLabel = propCount === 1 ? "property" : "properties";
    return `<summary style='${
      styles.caption
    }'>Object {${propCount} ${propLabel}}</summary>`;
  }
  return `<summary style='${styles.caption}'>${typeof feed}</summary>`;
};

const getTablePrefix = feed =>
  `<details open>${getCaption(feed)}<table style='${styles.table}'>`;
const tableSuffix = "</table></details";
const getValueColumn = value =>
  `<td style='${styles.column}'>${
    /* eslint-disable no-use-before-define */
    typeof value === "object" ? buildTable(value) : value
    /* eslint-enable no-use-before-define */
  }</td>`;
const getTableRow = (feed, child) =>
  `<tr><td style='${styles.column + styles.key}'>${child}</td>${getValueColumn(
    feed[child]
  )}</tr>`;

const buildTable = feed => {
  let stringzilla = getTablePrefix(feed);
  Object.keys(feed).forEach(child => {
    stringzilla += getTableRow(feed, child);
  });
  stringzilla += tableSuffix;
  return stringzilla;
};

document.write(`${buildTable(mockFeed)}`);

// @TODO Build Interface
// @TODO Int/string highlighting
// @TODO Obj/Array highlighting
// @TODO Handle empty objects/Arrays
// @TODO Array Layout
// @TODO time formating
