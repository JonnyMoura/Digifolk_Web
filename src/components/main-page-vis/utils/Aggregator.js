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
   * Group using d3.group()
   */
  const grouped = d3.group(
    expandedRows,
    d => d.value
  );

  /**
   * Convert to requested output structure
   */
  const result = Array.from(grouped, ([value, values]) => ({
    value,
    attribute: criteria,
    pieces: values.map(d => ({
      music_id: d.music_id
    }))
  }));

  return result;
};