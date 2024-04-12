module.exports = function(eleventyConfig) {
	eleventyConfig.setTemplateFormats([
		"md",
		"njk",
		"css"
	])

	return {
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site"
		}
	}
}
