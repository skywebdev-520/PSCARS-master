'use strict'
const { join } = require('path')
/**
 * For more details on each configuration option see http://pdfmake.org/#/gettingstarted.
 * Some of the configuration options have a slightly different name than their pdfmake
 * counterparts but they should still be self-explanatory.
 */

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Custom Font descriptors
  |--------------------------------------------------------------------------
  |
  | Override the default list of fonts to be used in the pdfmake instance.
  | This value must be an Object.
  |
  */
  fonts: {
    Roboto: {
      normal: join(__dirname, '..','resources/assets/font/Roboto-Regular.ttf'),
      bold: join(__dirname, '..','resources/assets/font/Roboto-Medium.ttf'),
      italics: join(__dirname, '..','resources/assets/font/Roboto-Italic.ttf'),
      bolditalics: join(__dirname, '..','resources/assets/font/Roboto-MediumItalic.ttf')
    },
    RobotoBold: {
      normal: join(__dirname, '..','resources/assets/font/Roboto-Bold.ttf'),
      italics: join(__dirname, '..','resources/assets/font/Roboto-BoldItalic.ttf')
    },
    RobotoBlack: {
      normal: join(__dirname, '..','resources/assets/font/Roboto-Black.ttf'),
      italics: join(__dirname, '..','resources/assets/font/Roboto-BlackItalic.ttf')
    },
    RobotoLight: {
      normal: join(__dirname, '..','resources/assets/font/Roboto-Light.ttf'),
      italics: join(__dirname, '..','resources/assets/font/Roboto-LightItalic.ttf')
    },
    RobotoThin: {
      normal: join(__dirname, '..','resources/assets/font/Roboto-Thin.ttf'),
      italics: join(__dirname, '..','resources/assets/font/Roboto-ThinItalic.ttf'),
    },
    Icons: {
      normal: join(__dirname, '..','resources/assets/font/icons.ttf'),
      
    }
  },

  /*
  |--------------------------------------------------------------------------
  | Custom style dictionaries
  |--------------------------------------------------------------------------
  |
  | If you reuse the same styles across your document(s) you can set them
  | here and they will be available for use within your content.
  |
  */
  styles: {
    default: {fontSize:8}
  },

  defaultStyle:{fontSize:8},
  /*
  |--------------------------------------------------------------------------
  | Custom header
  |--------------------------------------------------------------------------
  |
  | Set a header for each page. This value must be a String or a Function.
  |
  */
  header: null,

  /*
  |--------------------------------------------------------------------------
  | Custom footer
  |--------------------------------------------------------------------------
  |
  | Set a footer for each page. This value must be a String or a Function.
  |
  */
  footer: function(currentPage, pageCount) { 
    return [
      {
        text: "Seite "+currentPage.toString() + ' von ' + pageCount,
        alignment:"right",
        marginRight:50,
        marginTop:-50,
        fontSize:8
      }
    ] 
  },

  /*
  |--------------------------------------------------------------------------
  | Custom background
  |--------------------------------------------------------------------------
  |
  | Set a background for each page. This value must be a String or a
  | Function.
  |
  */
  background: null,

  /*
  |--------------------------------------------------------------------------
  | Custom page configuration
  |--------------------------------------------------------------------------
  |
  | Set up the page configuration for each page of your PDFs.
  |
  */
  page: {
    size: null,
    orientation: null,
    margins: null,
    
  }

}
