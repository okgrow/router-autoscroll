Template.registerHelper("dimsum", function(numParagraphs) {
  return dimsum(numParagraphs || 2, {format: 'html'});
});
