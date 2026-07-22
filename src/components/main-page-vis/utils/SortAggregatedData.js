// sortAggregatedData.js

/**
 * Sort aggregated data by `value`
 *
 * @param {Array} data
 * @param {"numeric"|"custom"} mode
 * @param {"asc"|"desc"} direction
 * @param {Array} customOrder
 * @returns {Array}
 */

export function sortAggregatedData(
    data,
    mode = "numeric",
    direction = "asc",
    customOrder = []
) {

    const sorted = [...data];

    sorted.sort((a, b) => {

        let comparison = 0;

        /**
         * --------------------------------------------------------
         * Numeric sorting
         * Example:
         * "1990", "2001", etc.
         * --------------------------------------------------------
         */
        if (mode === "numeric") {

            const aNum = Number(a.value);
            const bNum = Number(b.value);

            comparison = aNum - bNum;
        }

        /**
         * --------------------------------------------------------
         * Custom order sorting
         * Example:
         * ["bfhd", "abc"]
         * --------------------------------------------------------
         */
        else if (mode === "custom") {

            const aIndex = customOrder.indexOf(a.value);
            const bIndex = customOrder.indexOf(b.value);

            // values not found go to the end
            const safeA = aIndex === -1 ? Infinity : aIndex;
            const safeB = bIndex === -1 ? Infinity : bIndex;

            comparison = safeA - safeB;
        }

        else if (mode === "cluster_size") {
            comparison = a.pieces.length - b.pieces.length;
        }

        /**
         * --------------------------------------------------------
         * Direction
         * --------------------------------------------------------
         */
        return direction === "desc"
            ? -comparison
            : comparison;
    });

    return sorted;
}