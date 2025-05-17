import { DateTime } from "luxon";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("files");
  eleventyConfig.addPassthroughCopy("tracks");
  eleventyConfig.addWatchTarget("data");

  eleventyConfig.addFilter("dateFormat", (dateObj, format = "dd.MM.yyyy") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });
}
