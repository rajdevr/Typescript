import * as fs from 'fs';
import * as path from 'path';
import { Builder } from 'xml2js';



export interface GuestBooking{
    guestName: string,
    transactionType: string,
    amount:number;
}

export function readFinancialTransations(): GuestBooking[]{
    try{
        const filename = path.join(__dirname,'financialtransactions.json');
        const data=fs.readFileSync(filename,'utf-8');
        const guestTranscaction: GuestBooking[] = JSON.parse(data);
        return guestTranscaction;
    }
    catch(error){
         console.error('Error reading financialtransactions.json:', error.message);
        return [];

    }
}

 export const transactions: GuestBooking[] = readFinancialTransations();
console.log(transactions);

function generateFinancialPostings(guestBooking: GuestBooking[]): Record<string, number> {
    const financialPostings: Record<string, number> = {};
  
    // Group transactions by type and sum the amounts
    for (const transaction of guestBooking) {
      const { transactionType, amount } = transaction;
      if (financialPostings[transactionType]) {
        financialPostings[transactionType] += amount;
      } else {
        financialPostings[transactionType] = amount;
      }
    }
  
    return financialPostings;
  }

  const financialPostings = generateFinancialPostings(transactions);
console.log("GenerateFinancialPostings",financialPostings);

function convertFinancialPostingsToXML(financialPostings: Record<string,number>): string {
   
  const xmlBuilder = new Builder();
  const xmlObject = {
    financialCharges: {
      total: Object.entries(financialPostings).map(([transactionType, amount]) => ({
        transactionType,
        amount,
      })),
    },
  };

  const xml = xmlBuilder.buildObject(xmlObject);
  return xml;
}
const postingsXML: string = convertFinancialPostingsToXML(financialPostings);
console.log("XMLDATA-----FinancialPostings",postingsXML);

fs.writeFileSync('financialPostings.xml', postingsXML, 'utf-8');

console.log('Financial postings data written to files.');

