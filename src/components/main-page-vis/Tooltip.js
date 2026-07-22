import * as d3 from "d3";

/**
 * SVG Tooltip Component
 *
 * Props:
 * - svg: d3 svg selection
 * - x
 * - y
 * - title
 * - subtitle
 * - subsubtitle
 */

export const drawTooltip = ({ svg, x, y, title, subtitle, subsubtitle }) => {
	const svgNode = svg.node();

	const width = svgNode.clientWidth;
	const height = svgNode.clientHeight;

	const isLeft = x < width / 2;
	const isTop = y < height / 2;

	const margin = 20;

	// initial position
	let tooltipX = x;
	let tooltipY = y;

	/**
	 * Since there is no background and we do not know
	 * tooltip dimensions, we only offset relative to
	 * cursor direction.
	 */

	// right
	tooltipX += isLeft ? margin : -margin;

	// bottom / top
	tooltipY += isTop ? margin : -margin;

	// remove previous tooltip
	svg.select("#tooltip").remove();

	/**
	 * Main tooltip group
	 */
	const tooltip = svg
		.append("g")
		.attr("id", "tooltip")
		.attr("transform", `translate(${tooltipX}, ${tooltipY})`);

	const anchor = isLeft ? "start" : "end";

	/**
	 * Background
	 */
	/*
    tooltip.append("rect")
        .attr("width", 260)
        .attr("height", 70)
        .attr("rx", 8)
        .attr("ry", 8)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.95);
*/
	/**
	 * Title
	 */
	tooltip
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("class", "tooltip-title")
		.attr("text-anchor", anchor)
		.text(title);

	/**
	 * Subtitle
	 */
	tooltip
		.append("text")
		.attr("x", 0)
		.attr("y", 24)
		.attr("text-anchor", anchor)
		.attr("class", "tooltip-subtitle")
		.text(subtitle);

	/**
	 * Subsubtitle
	 */
	tooltip
		.append("text")
		.attr("x", 0)
		.attr("y", () => {
			if (subtitle) return 48;
			else return 24;
		})
		.attr("text-anchor", anchor)
		.attr("class", "tooltip-subsubtitle")
		.text(subsubtitle);
};

export const createTooltip = ({
	svg,
	x,
	y,
	title,
	subtitle,
	subsubtitle,
	piece,
	expandedAttributes,
}) => {
	svg.select("#tooltip").remove();

	const tooltip = svg.append("g").attr("id", "tooltip");

	const content = tooltip.append("g").attr("class", "tooltip-content");

	const compactSection = content.append("g").attr("class", "tooltip-compact");

	const expandedSection = content
		.append("g")
		.attr("class", "tooltip-expanded-section")
		.attr("transform", `translate(0, ${subtitle ? 64 : 40})`)
		.style("display", "none");

	expandedSection
		.append("line")
		.attr("class", "tooltip-divider")
		//.attr("x1", 0)
		//.attr("x2", 120)
		.attr("y1", 0)
		.attr("y2", 0);

	compactSection.append("text").attr("class", "tooltip-title");

	compactSection.append("text").attr("class", "tooltip-subtitle");

	compactSection.append("text").attr("class", "tooltip-subsubtitle");

	updateTooltipContent({
		tooltip,
		title,
		subtitle,
		subsubtitle,
	});

	updateTooltipExpandedContent({
		expandedSection,
		piece,
		expandedAttributes,
	});

	updateTooltipPosition({
		svg,
		x,
		y,
	});

	addTooltipBackground(tooltip);

	return tooltip;
};

function addTooltipBackground(tooltip) {
	const padding = 20;
    const paddingVertical = 12;

	const bbox = tooltip.select(".tooltip-content").node().getBBox();

	tooltip
		.insert("rect", ":first-child")
		.attr("class", "tooltip-background")
		.attr("x", bbox.x - padding)
		.attr("y", bbox.y - paddingVertical)
		.attr("width", bbox.width + padding * 2)
		.attr("height", bbox.height + paddingVertical * 2)
		.attr("rx", 8)
		.attr("ry", 8);
}

function updateTooltipBackground(tooltip) {
	const padding = 20;
    const paddingVertical = 12;

	const bbox = tooltip.select(".tooltip-content").node().getBBox();

	tooltip
		.select(".tooltip-background")
		.attr("x", bbox.x - padding)
		.attr("y", bbox.y - paddingVertical)
		.attr("width", bbox.width + padding * 2)
		.attr("height", bbox.height + paddingVertical * 2);
}

function updateTooltipExpandedContent({
	expandedSection,
	piece,
	expandedAttributes,
	attributeLabels = {
		genre: "Genre",
		tempo: "Tempo",
		mode: "Mode",
		meter: "Meter",
		instruments: "Instruments",
		"real_key": "Key",
		language: "Language",
		"spatial.country": "Country",
		"temporal.year": "Year",
		"coverage": "Coverage",
	}
}) {
	const attributes = getPieceAttributes(piece, expandedAttributes);

	let i = 0;
	attributes.forEach((attribute, index) => {
		const value = Array.isArray(attribute.value)
			? attribute.value.join(", ")
			: attribute.value;

			if (value === undefined || value === null || value === "") {
				return;
			}
		expandedSection
			.append("text")
			.attr("class", "tooltip-attribute")
			.attr("x", 0)
			.attr("y", 24 + i * 18)
			.text(
				`${attributeLabels[attribute.attribute] || attribute.attribute}: ${value}`,
			);

			i++;
	});
}

export const updateTooltipPosition = ({ svg, x, y }) => {
	const tooltip = svg.select("#tooltip");

	if (tooltip.empty()) return;

	const svgNode = svg.node();

	const width = svgNode.clientWidth;
	const height = svgNode.clientHeight;

	const isLeft = x < width / 2;
	const isTop = y < height / 2;

	const margin = 20;

	let tooltipX = x;
	let tooltipY = y;

	tooltipX += isLeft ? margin : -margin;
	tooltipY += isTop ? margin : -margin;

	tooltip.attr("transform", `translate(${tooltipX},${tooltipY})`);

	tooltip.selectAll("text").attr("text-anchor", isLeft ? "start" : "end");

	tooltip
		.select(".tooltip-divider")
		.attr("x1", isLeft ? 0 : -120)
		.attr("x2", isLeft ? 120 : 0);
};

export const updateTooltipContent = ({
	tooltip,
	title,
	subtitle,
	subsubtitle,
}) => {
	tooltip.select(".tooltip-title").attr("x", 0).attr("y", 0).text(title);

	tooltip.select(".tooltip-subtitle").attr("x", 0).attr("y", 24).text(subtitle);

	tooltip
		.select(".tooltip-subsubtitle")
		.attr("x", 0)
		.attr("y", subtitle ? 46 : 22)
		.text(subsubtitle);
};

export function removeTooltip(svg) {
	svg.select("#tooltip").remove();
}

export function expandTooltip(svg) {
	const tooltip = svg.select("#tooltip");

	if (tooltip.empty()) return;

	tooltip.classed("tooltip-expanded", true);
	tooltip.select(".tooltip-expanded-section").style("display", null);

	updateTooltipBackground(tooltip);
}

export function collapseTooltip(svg) {
	const tooltip = svg.select("#tooltip");

	if (tooltip.empty()) return;

	tooltip.classed("tooltip-expanded", false);
	tooltip.select(".tooltip-expanded-section").style("display", "none");
	updateTooltipBackground(tooltip);
}

function getNestedValue(obj, path) {
	return path.split(".").reduce((current, key) => current?.[key], obj);
}

function getPieceAttributes(piece, allowedAttributes) {
	return allowedAttributes
		.map((attribute) => {
			const value = getNestedValue(piece, attribute);

			if (value === undefined || value === null || value === "") {
				return null;
			}

			return {
				attribute,
				value,
			};
		})
		.filter(Boolean);
}
