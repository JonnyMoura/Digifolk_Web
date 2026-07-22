import * as d3 from 'd3';

export const createEllipseLayout = ({data_aggregated, centerX, centerY, width, height}) => {

    const groupPositions = new Map();

    data_aggregated.forEach((group, i) => {
        const angle = (i / data_aggregated.length) * Math.PI * 2 - Math.PI / 2;

        groupPositions.set(group.value, {
            x: centerX + Math.cos(angle) * width / 3.5,

            y: centerY + Math.sin(angle) * height / 3.5
        });
    });

    return groupPositions;
};


/**
 * =========================================================
 * CUSTOM PACKED LAYOUT
 * =========================================================
 *
 * Creates centroid positions proportional
 * to group size using d3.pack().
 *
 * Similar visual logic to Voronoi partitioning.
 */

export const createCustomLayout = ({
    data_aggregated,
    width,
    height,
    padding = 30,
    padding_top = 250
}) => {

    /**
     * Convert aggregated groups into hierarchy
     */

    const root = d3.hierarchy({

        children: data_aggregated.map(group => ({

            name: group.value,

            value: group.pieces.length
        }))
    })
    .sum(d => d.value);

    /**
     * Packed-circle layout
     */

    const pack = d3.pack()
        .size([
            width - padding * 2,
            height - padding * 2
        ])
        .padding(20);

    const packedRoot = pack(root);

    /**
     * Extract centroids
     */



    /**
     * Extract centroids
     */

    const leaves = packedRoot.leaves();

    /**
     * Compute bounds
     */

    const minX = d3.min(leaves, d => d.x - d.r);
    const maxX = d3.max(leaves, d => d.x + d.r);

    const minY = d3.min(leaves, d => d.y - d.r);
    const maxY = d3.max(leaves, d => d.y + d.r);

    /**
     * Scale packed layout to fill canvas
     */

    const scaleX = (width - padding * 2) / (maxX - minX);

    const scaleY =
        (height - padding * 2) / (maxY - minY);

    const groupPositions = new Map();

    leaves.forEach(node => {

        const normalizedX =
            (node.x - minX) * scaleX;

        const normalizedY =
            (node.y - minY) * scaleY;

        groupPositions.set(node.data.name, {

            x: normalizedX + padding,

            y: normalizedY + padding + padding_top,

            r: node.r
        });
    });

    return groupPositions;
};