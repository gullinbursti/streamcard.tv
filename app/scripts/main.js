$(function() {
  'use strict';

  $('body').append(
    Handlebars.Templates['template'](),
    Handlebars.Templates['hello']()
  );

}());