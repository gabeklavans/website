import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";

export default function (eleventyConfig) {
    const mdConfig = {
        html: true,
        linkify: false,
    };
    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.configure(mdConfig));
    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItFootnote));

    eleventyConfig.addFilter("longDate", (date) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        return date.toLocaleDateString(undefined, options);
    });

    eleventyConfig.addCollection("posts", (collectionApi) => {
        let posts = collectionApi.getFilteredByTag("post");
        let cringe = collectionApi.getFilteredByTag("cringe");
        return posts.filter((post) => !cringe.includes(post));
    });

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

    const parseDate = (str) => {
        if (str instanceof Date) {
            return str;
        }
        return new Date(str);
    };

    eleventyConfig.addFilter("date_to_datetime", async (obj) => {
        if (!obj) {
            return "";
        }
        const date = parseDate(obj);
        return date.toISOString();
    });

    eleventyConfig.addPlugin(syntaxHighlight);

    return {
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
    };
}
