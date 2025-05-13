import Fetch from "@11ty/eleventy-fetch";

export default async function() {
    let url = "https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.txt";

    return await Fetch(url, {
        duration: "1d",
        type: "text",
    });
}
