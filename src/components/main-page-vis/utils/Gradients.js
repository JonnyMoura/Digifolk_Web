import * as d3 from 'd3';



const customPalette = [

    "#FF6B6B", // coral red
    "#4D96FF", // vivid blue
    "#6BCB77", // fresh green
    "#FFD93D", // warm yellow
    "#845EC2", // purple
    "#FF9671", // peach orange
    "#00C9A7", // turquoise
    "#F15BB5", // pink magenta
    "#3A86FF", // electric blue
    "#A0C4FF", // soft azure
    "#C77DFF", // lavender violet
    "#FF9F1C", // amber orange
    "#2EC4B6"  // teal
];


/*
const customPalette = [
    '#1E3A5F', // deep navy
    '#2F4F7C', // muted blue
    '#4F6D9A', // steel blue
    '#0E74B8', // bright IEEE blue
    '#2AA7D6', // cyan blue
    '#53C7D9', // aqua
    '#8CC63E', // lime green
    '#C7D63C', // yellow-green
    '#F2D94E', // warm yellow
    '#F5A623', // orange
    '#E94E3D', // coral red
    '#D9386E', // magenta
    '#A84CCF', // purple
    '#EAE7E1', // warm off-white
    '#D6D2CC', // soft gray-beige
];
*/

/*
const customPalette = [
  "#1F77B4", // blue
  "#FF7F0E", // orange
  "#2CA02C", // green
  "#D62728", // red
  "#9467BD", // purple
  "#8C564B", // brown
  "#E377C2", // pink
  "#7F7F7F", // gray
  "#BCBD22", // olive
  "#17BECF", // cyan
  "#F4A261", // sand
  "#264653", // dark teal
  "#E76F51", // terracotta
  "#6A994E", // moss green
  "#577590"  // muted steel blue
];
*/

export function createGradients(svg, data_aggregated) {

            /**
             * ------------------------------------------------------------------
             * Create gradients
             * ------------------------------------------------------------------
             */
    
            const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
    
            // Example color scale for groups
            //const colorScale = d3.scaleOrdinal(d3.schemeSet3); // schemePaired
            const colorScale = d3.scaleOrdinal().range(customPalette);
    
            // Remove old gradients
            defs.selectAll('.group-gradient').remove();
    
            // Create one gradient per group
            data_aggregated.forEach((group, i) => {
                const gradient = defs
                    .append('linearGradient')
                    .attr('id', `gradient-${i}`)
                    .attr('class', 'group-gradient')
                    .attr('x1', '30%')
                    .attr('y1', '30%')
                    .attr('x2', '70%')
                    .attr('y2', '70%');
    
                gradient
                    .append('stop')
                    .attr('offset', '0%')
                    //.attr("stop-color", d3.color(colorScale(group.value)).brighter(0.25));
                    .attr('stop-color', d3.color(colorScale(group.value)).brighter(Math.random() * 0.2 + 0.1));
    
                gradient
                    .append('stop')
                    .attr('offset', '100%')
                    //.attr("stop-color", d3.color(colorScale(group.value)).darker(0.1));
                    .attr('stop-color', d3.color(colorScale(group.value)).darker(Math.random() * 0.2 + 0.1));
            });
    
            const gradient = defs
                .append('linearGradient')
                .attr('id', `gradient-free`)
                .attr('class', 'group-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '100%');
    
            gradient.append('stop').attr('offset', '0%').attr('stop-color', '#aab4c9');

            gradient.append('stop').attr('offset', '100%').attr('stop-color', '#7c879e');
}