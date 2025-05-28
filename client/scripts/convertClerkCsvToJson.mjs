// client/scripts/convertClerkCsvToJson.mjs
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser'; // csv-parser supports ES module imports
import { fileURLToPath } from 'url'; // To get __dirname in ES modules

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvHeaderToSchemaKeyMap = {
    'id': 'clerkId',
    'first_name': 'firstName',
    'last_name': 'lastName',
    'username': 'username',
    'primary_email_address': 'primaryEmailAddress',
    'primary_phone_number': 'primaryPhoneNumber',
    'verified_email_addresses': 'verifiedEmailAddresses',
    'unverified_email_addresses': 'unverifiedEmailAddresses',
    'verified_phone_numbers': 'verifiedPhoneNumbers',
    'unverified_phone_numbers': 'unverifiedPhoneNumbers',
    'totp_secret': 'totpSecret',
    'password_digest': 'passwordDigest',
    'password_hasher': 'passwordHasher'
};

async function convertCsvToJson() {
    const records = [];
    // Script is in client/scripts. CSV is in the root of dantealighieri.ma
    const csvFilePath = path.resolve(__dirname, '../../clerk-users.csv');
    const outputJsonPath = path.resolve(__dirname, 'clerkUsersForImport.json');

    if (!fs.existsSync(csvFilePath)) {
        console.error(`CSV file not found at: ${csvFilePath}`);
        process.exit(1);
    }

    console.log(`Reading CSV from: ${csvFilePath}`);

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            const jsonRecord = {};
            for (const csvHeader in row) {
                const schemaKey = csvHeaderToSchemaKeyMap[csvHeader];
                if (schemaKey) {
                    jsonRecord[schemaKey] = row[csvHeader];
                }
            }
            if (jsonRecord.clerkId) {
                records.push(jsonRecord);
            } else {
                console.warn("Skipping record due to missing 'id' (clerkId):", row);
            }
        })
        .on('end', () => {
            try {
                fs.writeFileSync(outputJsonPath, JSON.stringify(records, null, 2));
                console.log(`Successfully converted ${records.length} records.`);
                console.log(`JSON output saved to: ${outputJsonPath}`);
                console.log("\n--- Next Steps ---");
                console.log("1. Ensure you have created the 'ClerkUserRaw' model/collection in your MongoDB.");
                console.log("2. You can now manually import the generated 'clerkUsersForImport.json' file into your MongoDB collection (e.g., 'clerkuserraws').");
                console.log("   - Using MongoDB Compass: Connect to your DB, select the database, click 'Create Collection' (if 'clerkuserraws' doesn't exist or choose existing), then 'Add Data' -> 'Import JSON or CSV file'.");
                console.log("   - Using mongoimport (CLI): mongoimport --uri \"your_mongodb_uri\" --collection clerkuserraws --file ./clerkUsersForImport.json --jsonArray");

            } catch (err) {
                console.error('Error writing JSON file:', err);
            }
            process.exit(0);
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            process.exit(1);
        });
}

convertCsvToJson();