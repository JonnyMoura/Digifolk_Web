import * as d3 from "d3";

/**
 * Aggregates music data by a given criterion.
 *
 * Output format:
 * [
 *   {
 *     value: "1952",
 *     attribute: "temporal.year",
 *     pieces: [
 *       { music_id: 118 },
 *       { music_id: 200 }
 *     ]
 *   }
 * ]
 *
 * Supported criteria:
 * - Simple attributes:
 *   "language", "meter", "tempo", etc.
 *
 * - Nested attributes:
 *   "temporal.year"
 *   "temporal.decade"
 *   "spatial.country"
 *
 * - Multi-value attributes:
 *   "genre"
 *   "instruments"
 *   "subject"
 */

export const aggregateByCriteria = (data, criteria) => {

  /**
   * Returns nested property value using dot notation
   * Example:
   * getNestedValue(obj, "temporal.year")
   */
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  /**
   * Creates flat rows for grouping
   */
  const expandedRows = [];

  data.forEach(piece => {

    let values = getNestedValue(piece, criteria);

    // Handle undefined/null
    if (values === undefined || values === null) {
      return;
    }

    // Convert single values into array
    if (!Array.isArray(values)) {
      values = [values];
    }

    // Repeat datapoint for each value
    values.forEach(value => {

      // Ignore empty strings
      if (value === "") return;

      expandedRows.push({
        value,
        music_id: piece.music_id
      });

    });

  });

  /**
   * Group case-insensitively so values that only differ by
   * capitalization (e.g. "Major" / "major", "Children Song" /
   * "Children song") aren't split into separate, differently
   * coloured clusters.
   */
  const normalizeKey = value =>
    typeof value === "string" ? value.trim().toLowerCase() : value;

  const grouped = d3.group(
    expandedRows,
    d => normalizeKey(d.value)
  );

  /**
   * Convert to requested output structure.
   * The most common casing among the grouped rows is used as the
   * display value.
   */
  const result = Array.from(grouped, ([, rows]) => {
    const displayCounts = d3.rollup(rows, v => v.length, d => d.value);
    const [displayValue] = Array.from(displayCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      value: displayValue,
      attribute: criteria,
      pieces: rows.map(d => ({
        music_id: d.music_id
      }))
    };
  });

  return result;
};