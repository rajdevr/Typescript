"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactions = exports.readFinancialTransations = void 0;
var fs = require("fs");
var path = require("path");
var xml2js_1 = require("xml2js");
function readFinancialTransations() {
    try {
        var filename = path.join(__dirname, 'financialtransactions.json');
        var data = fs.readFileSync(filename, 'utf-8');
        var guestTranscaction = JSON.parse(data);
        return guestTranscaction;
    }
    catch (error) {
        console.error('Error reading financialtransactions.json:', error.message);
        return [];
    }
}
exports.readFinancialTransations = readFinancialTransations;
exports.transactions = readFinancialTransations();
console.log(exports.transactions);
function generateFinancialPostings(guestBooking) {
    var financialPostings = {};
    // Group transactions by type and sum the amounts
    for (var _i = 0, guestBooking_1 = guestBooking; _i < guestBooking_1.length; _i++) {
        var transaction = guestBooking_1[_i];
        var transactionType = transaction.transactionType, amount = transaction.amount;
        if (financialPostings[transactionType]) {
            financialPostings[transactionType] += amount;
        }
        else {
            financialPostings[transactionType] = amount;
        }
    }
    return financialPostings;
}
var financialPostings = generateFinancialPostings(exports.transactions);
console.log("GenerateFinancialPostings", financialPostings);
function convertFinancialPostingsToXML(financialPostings) {
    var xmlBuilder = new xml2js_1.Builder();
    var xmlObject = {
        financialCharges: {
            total: Object.entries(financialPostings).map(function (_a) {
                var transactionType = _a[0], amount = _a[1];
                return ({
                    transactionType: transactionType,
                    amount: amount,
                });
            }),
        },
    };
    var xml = xmlBuilder.buildObject(xmlObject);
    return xml;
}
var postingsXML = convertFinancialPostingsToXML(financialPostings);
console.log("XMLDATA-----FinancialPostings", postingsXML);
fs.writeFileSync('financialPostings.xml', postingsXML, 'utf-8');
console.log('Financial postings data written to files.');
