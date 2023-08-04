import * as fs from 'fs';
import * as path from 'path';
import { Builder } from 'xml2js';

import { transactions } from './financedataJson';
import { GuestBooking } from './financedataJson';

interface GuestData {
    guestName: string; 
    checkInDate: Date;
    checkOutDate: Date;
    roomType: String;
    totalAmount: number;
}


function readGuestBookings(): GuestData[]{
    try{
        const filename = path.join(__dirname, 'guestBookings.json');
 const data =fs.readFileSync(filename,'utf-8');
    const guestBooking : GuestData[] = JSON.parse(data);
    return guestBooking;
    }
    catch(error){
        console.error('Error reading guestBookings.json:', error.message);
        return [];
    }
}

const bookings: GuestData[] = readGuestBookings();
console.log("ReadGuestBookings",bookings);





function generateFinancialCharges( guestData: GuestData[],guestBooking: GuestBooking[]):Record<string,number>{

    const financialCharges: Record<string, number> = {};

    for (const booking of guestData) {
        const { guestName, totalAmount } = booking;
        financialCharges[guestName] = totalAmount;
    }
      
  for (const transaction of guestBooking) {
    const { guestName, amount } = transaction;
    financialCharges[guestName] += amount;
  }

  return financialCharges;

}

const financialCharge = generateFinancialCharges(bookings,transactions);
console.log("Generatefinancialcharges",financialCharge);



function convertFinancialChargesToXML(financialCharge: Record<string,number>): string {
   
    const xmlBuilder = new Builder();
    const xmlObject = {
      financialCharges: {
        guestCharge: Object.entries(financialCharge).map(([guestName, amount]) => ({
          guestName,
          amount,
        })),
      },
    };
  
    const xml = xmlBuilder.buildObject(xmlObject);
    return xml;
}
const guestchargesXML: string = convertFinancialChargesToXML(financialCharge);
console.log("XMLDATA-----GuestTotalCharges",guestchargesXML);

fs.writeFileSync('financialCharges.xml', guestchargesXML, 'utf-8');

console.log('Financial postings data written to files.');

console.log(JSON.stringify(financialCharge));
