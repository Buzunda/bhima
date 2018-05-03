/**
 * This file contains shared information between all inventory
 * elements (metadata, groups, types, unit, ...)
 */
const uuid = require('uuid/v4');

const inventoryGroup = {
  uuid : uuid(),
  code : '99',
  name : 'Test Inventory Group 2',
  stock_account : 162, // 31110010 - 'Medicaments en comprimes *'
  sales_account : 242, // 70111010 - Vente Medicaments en comprimes
  cogs_account : 209, // 60310010 - Médicaments en comprimés
  expires : 1,
  unique_item : 0,
};

const updateGroup = {
  code : '111',
  name : 'Updated Inventory Group',
  stock_account : 163, // 31110011 - Medicaments en Sirop *
  sales_account : 242, // 70111010 - Vente Medicaments en comprimes
  cogs_account : 209, // 60310010 - Médicaments en comprimés
  expires : 1,
  unique_item : 0,
};

const inventoryType = {
  text : '[Test] Article Laboratoire',
};

const updateType = {
  text : '[Test] Article Chirurgie',
};

const inventoryUnit = {
  text : '[Test] Comprimés',
  abbr : 'TC',
};

const updateUnit = {
  text : '[Test] Gellule',
  abbr : 'TG',
};

module.exports = {
  inventoryGroup,
  updateGroup,
  inventoryType,
  updateType,
  inventoryUnit,
  updateUnit,
};
