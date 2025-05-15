export default function () {
    return {
        analyticsId: process.env.ANALYTICS_ID || "",
        branch: process.env.CF_PAGES_BRANCH || "testing"
    };
}
