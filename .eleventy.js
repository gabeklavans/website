module.exports = function(eleventyConfig) {
	eleventyConfig.setTemplateFormats([
		"md",
		"njk",
		"css"
	])

	eleventyConfig.addFilter("longDate", (date) => {
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};

		return date.toLocaleDateString(undefined, options);
	})

	eleventyConfig.addCollection("posts", (collectionApi) => {
		let posts = collectionApi.getFilteredByTag("post");
		let cringe = collectionApi.getFilteredByTag("cringe");
		return posts.filter(post => !cringe.includes(post));
	})

	eleventyConfig.addPassthroughCopy({ "src/static": "/" });

	return {
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site"
		}
	}
}
