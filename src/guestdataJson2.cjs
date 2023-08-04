"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var xml2js_1 = require("xml2js");
var financedataJson_1 = require("./financedataJson.cjs");
function readGuestBookings() {
    try {
        var filename = path.join(__dirname, 'guestBookings.json');
        var data = fs.readFileSync(filename, 'utf-8');
        var guestBooking = JSON.parse(data);
        return guestBooking;
    }
    catch (error) {
        console.error('Error reading guestBookings.json:', error.message);
        return [];
    }
}
var bookings = readGuestBookings();
console.log("ReadGuestBookings", bookings);
function generateFinancialCharges(guestData, guestBooking) {
    var financialCharges = {};
    for (var _i = 0, guestData_1 = guestData; _i < guestData_1.length; _i++) {
        var booking = guestData_1[_i];
        var guestName = booking.guestName, totalAmount = booking.totalAmount;
        financialCharges[guestName] = totalAmount;
    }
    for (var _a = 0, guestBooking_1 = guestBooking; _a < guestBooking_1.length; _a++) {
        var transaction = guestBooking_1[_a];
        var guestName = transaction.guestName, amount = transaction.amount;
        financialCharges[guestName] += amount;
    }
    return financialCharges;
}
var financialCharge = generateFinancialCharges(bookings, financedataJson_1.transactions);
console.log("Generatefinancialcharges", financialCharge);
function convertFinancialChargesToXML(financialCharge) {
    var xmlBuilder = new xml2js_1.Builder();
    var xmlObject = {
        financialCharges: {
            guestCharge: Object.entries(financialCharge).map(function (_a) {
                var guestName = _a[0], amount = _a[1];
                return ({
                    guestName: guestName,
                    amount: amount,
                });
            }),
        },
    };
    var xml = xmlBuilder.buildObject(xmlObject);
    return xml;
}
var guestchargesXML = convertFinancialChargesToXML(financialCharge);
console.log("XMLDATA-----GuestTotalCharges", guestchargesXML);
fs.writeFileSync('financialCharges.xml', guestchargesXML, 'utf-8');
console.log('Financial postings data written to files.');

console.log(JSON.stringify(financialCharge));
