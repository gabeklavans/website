import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default function(eleventyConfig) {
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
	eleventyConfig.addPassthroughCopy({ "src/*.css": "/" });

	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: "/feed.xml",
		collection: {
			name: "posts",
			limit: 0,
		},
		metadata: {
			language: "en",
			title: "gabe blog",
			subtitle: "welcome. find my posts interesting, I dare you",
			base: "https://dabe.tech",
			author: {
				name: "gabe",
				email: "gabecodes@fastmail.com",
			},
		},
	});

	return {
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site"
		}
	}
}
