/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

let price_int='';
let price_dec='';
let concat_val='';
let subtotal;
let total;

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    setInt: (val) => {
      return (price_int = val)
    },
    getInt: () => {
      return price_int;
    },

    setDec: (val) => {
      return (price_dec = val)
    },
    getDec: () => {
      return price_dec;
    },

    setConcat: (val) => {
      return (concat_val = val);
    },
    getConcat: () => {
      return concat_val;
    },

    setSubTotal: (val) => {
      return (subtotal = val)
    },
    getSubTotal: () => {
      return subtotal;
    },

    setTotal: (val) => {
      return (total = val)
    },
    getTotal: () => {
      return total;
    },
  });
}
