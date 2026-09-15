const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING DUAL BRAND ARCHITECTURE VERIFICATION TESTS ---');

// 1. Verify index.html (Global Producer Homepage)
console.log('Testing index.html...');
const indexPath = path.join(rootDir, 'index.html');
assert.ok(fs.existsSync(indexPath), 'index.html must exist');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

assert.ok(indexHtml.includes('1890'), 'index.html must feature 1890 heritage');
assert.ok(indexHtml.includes('Guaimaca'), 'index.html must mention Guaimaca origin');
assert.ok(indexHtml.includes('trade.html'), 'index.html must link to trade.html B2B export portal');
assert.ok(indexHtml.includes('cafe.html'), 'index.html must link to cafe.html cafeteria section');
assert.ok(/washed|lavado/i.test(indexHtml), 'index.html must detail coffee processing (washed)');
assert.ok(/honey|miel/i.test(indexHtml), 'index.html must detail coffee processing (honey)');
assert.ok(/natural/i.test(indexHtml), 'index.html must detail coffee processing (natural)');
assert.ok(indexHtml.includes('brand-switcher'), 'index.html must have brand switcher bar');

// 2. Verify trade.html (B2B Export Trade Hub)
console.log('Testing trade.html...');
const tradePath = path.join(rootDir, 'trade.html');
assert.ok(fs.existsSync(tradePath), 'trade.html must exist');
const tradeHtml = fs.readFileSync(tradePath, 'utf-8');

assert.ok(tradeHtml.includes('b2bSampleForm'), 'trade.html must contain b2bSampleForm');
assert.ok(tradeHtml.includes('businessName'), 'trade.html must require business/importer name');
assert.ok(tradeHtml.includes('targetVolume'), 'trade.html must require target volume');
assert.ok(tradeHtml.includes('roastProfile'), 'trade.html must require roasting profile preference');
assert.ok(tradeHtml.includes('contactName'), 'trade.html must require contact name');
assert.ok(tradeHtml.includes('email'), 'trade.html must require business email');
assert.ok(tradeHtml.includes('country'), 'trade.html must require destination country');
assert.ok(tradeHtml.includes('export@5tacafe.com'), 'trade.html must include direct export contact routing');
assert.ok(tradeHtml.includes('Puerto Cortés'), 'trade.html must include shipping port info');

// 3. Verify cafe.html (Local Retail Cafeteria Page)
console.log('Testing cafe.html...');
const cafePath = path.join(rootDir, 'cafe.html');
assert.ok(fs.existsSync(cafePath), 'cafe.html must exist');
const cafeHtml = fs.readFileSync(cafePath, 'utf-8');

assert.ok(cafeHtml.includes('7:00 AM') || cafeHtml.includes('7:00'), 'cafe.html must specify store hours');
assert.ok(cafeHtml.includes('Guaimaca'), 'cafe.html must specify store location in Guaimaca');
assert.ok(cafeHtml.includes('Espresso') || cafeHtml.includes('Cappuccino'), 'cafe.html must feature espresso menu');
assert.ok(cafeHtml.includes('Combo Mañanero') || cafeHtml.includes('Promociones'), 'cafe.html must include local promotions');
assert.ok(cafeHtml.includes('trade.html') || cafeHtml.includes('index.html'), 'cafe.html must link back to global producer/export');

// 4. Verify script.js (Form logic & Validation)
console.log('Testing js/script.js...');
const scriptPath = path.join(rootDir, 'js', 'script.js');
assert.ok(fs.existsSync(scriptPath), 'js/script.js must exist');
const scriptJs = fs.readFileSync(scriptPath, 'utf-8');

assert.ok(scriptJs.includes('b2bSampleForm'), 'script.js must handle b2bSampleForm');
assert.ok(scriptJs.includes('businessName'), 'script.js must validate businessName');
assert.ok(scriptJs.includes('targetVolume'), 'script.js must validate targetVolume');
assert.ok(scriptJs.includes('roastProfile'), 'script.js must validate roastProfile');
assert.ok(scriptJs.includes('REQ-5TA'), 'script.js must generate sample request code');

console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
