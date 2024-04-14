module.exports = function(eleventyConfig) {
	eleventyConfig.setTemplateFormats([
		"md",
		"njk",
		"css"
	])

	eleventyConfig.addFilter("longDate", (date) => {
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};

		return date.toLocaleDateString(undefined, options);
	})

	return {
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site"
		}
	}
}
