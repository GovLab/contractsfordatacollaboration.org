const CleanCSS = require("clean-css");
const { DateTime } = require('luxon');
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {

  // CSS minification
  eleventyConfig.addFilter('cssmin', function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // HTML minification
  /*
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });
  */

  // Passthrough
  eleventyConfig.addPassthroughCopy('site/admin');
  eleventyConfig.addPassthroughCopy('site/static');

  // Aliases
  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
  eleventyConfig.addLayoutAlias('resources', 'layouts/resources.njk');
  eleventyConfig.addLayoutAlias('library', 'layouts/library.njk');

  // Filters

  // Date filters for human-readable dates
  eleventyConfig.addFilter("readableDate", dateObj => {
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("MMM dd, yyyy");
	});

  // Collections

  // Add collection for resources
  eleventyConfig.addCollection('resources', function(collection) {
    return collection.getAll().filter(function(item){
      if( item.inputPath.match(/^\.\/site\/resources\//) !== null ) {
			 return item;
		 }
    }).sort(function(a, b) {
			return b.date - a.date;
		});
  });

  // Add colleciton for resources tagged as case studies
  eleventyConfig.addCollection('resouces', function(collection) {
    return collection.getAll().filter(function(item){
      if( item.data.type == 'case-study' && item.inputPath.match(/^\.\/site\/resources\//) !== null ) {
			 return item;
		 }
    }).sort(function(a, b) {
			return b.date - a.date;
		});
  });

  // Add colleciton for resources tagged asr reports
  eleventyConfig.addCollection('reports', function(collection) {
    return collection.getAll().filter(function(item){
      if( item.data.type == 'report' && item.inputPath.match(/^\.\/site\/resources\//) !== null ) {
       return item;
     }
    }).sort(function(a, b) {
			return b.date - a.date;
		});
  });

  return {
    pathPrefix: "/",
    dir: {
      input: "site",
      output: "dist",
      includes: "_includes"
    },
    passthroughFileCopy: true,
    templateFormats: [ "md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };

};
