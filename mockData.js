import { v4 as uuidv4 } from 'uuid';

function setMockData(connection) {
    const userID = '63e0afc2-3b20-4646-bb4c-25eef32ef1f1';
    // Create new budget
    const budgetID = uuidv4();
    const budgetName = 'My New Budget';
    const budgetDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const budgetSQL = `INSERT INTO budget (id, name, date) VALUES ('${budgetID}','${budgetName}','${budgetDate}')`;

    const accountID1 = uuidv4();
    const accountID2 = uuidv4();
    const accountName1 = 'Checking'
    const accountName2 = 'Credit'
    const accoutnBalance1 = 1373.47;
    const accountBalance2 = 11.56;
    const accountSQL = `INSERT INTO account (id, name, balance) VALUES ('${accountID1}','${accountName1}','${accoutnBalance1}'),('${accountID2}','${accountName2}','${accountBalance2}')`;

    const catID1 = uuidv4();
    const catID2 = uuidv4();
    const catName1 = uuidv4();
    const catName2 = uuidv4();
    const catSQL = `INSERT INTO category (id, name) VALUES ('${catID1}','${catName1}'),('${catID2}','${catName2}')`;

    const subcatID1 = uuidv4();
    const subcatID2 = uuidv4();
    const subcatID3 = uuidv4();
    const subcatID4 = uuidv4();
    const subcatName1 = 'Food';
    const subcatName2 = 'Gas';
    const subcatName3 = 'Crunchyroll';
    const subcatName4 = 'Video Games';
    const subcatSQL = `INSERT INTO subcategory (id, name) VALUES ('${subcatID1}','${subcatName1}'),('${subcatID2}','${subcatName2}'),('${subcatID3}','${subcatName3}'),('${subcatID4}','${subcatName4}')`;

    const allocationID1 = uuidv4();
    const allocationID2 = uuidv4();
    const allocationID3 = uuidv4();
    const allocationID4 = uuidv4();
    const allocationDate1 = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const allocationDate2 = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const allocationDate3 = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const allocationDate4 = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const allocationAmount1 = 200.50;
    const allocationAmount2 = 100.00;
    const allocationAmount3 = 10.50;
    const allocationAmount4 = 45.75;
    const allocationSQL = `INSERT INTO allocation (id, date, amount) VALUES ('${allocationID1}','${allocationDate1}','${allocationAmount1}'), ('${allocationID2}','${allocationDate2}','${allocationAmount2}'), ('${allocationID3}','${allocationDate3}','${allocationAmount3}'), ('${allocationID4}','${allocationDate4}','${allocationAmount4}')`;


    // Generate these shits:
    connection.query(budgetSQL, (error, result) => {
        if (error) {
            console.log(`Budget failed: ${error}`);
        } else {
            console.log('Budget successful.');
        }
    });

    connection.query(accountSQL, (error, result) => {
        if (error) {
            console.log(`Accounts failed: ${error}`);
        } else {
            console.log('Accounts successful.');
        }
    });

    connection.query(catSQL, (error, result) => {
        if (error) {
            console.log(`Categories failed: ${error}`);
        } else {
            console.log('Categories successful.');
        }
    });

    connection.query(subcatSQL, (error, result) => {
        if (error) {
            console.log(`Subcategories failed: ${error}`);
        } else {
            console.log('Subcategories successful.');
        }
    });

    connection.query(allocationSQL, (error, result) => {
        if (error) {
            console.log(`Allocations failed: ${error}`);
        } else {
            console.log('Allocations successful.');
        }
    });

    // Linking these shits
    const userBudgetSQL = `INSERT INTO user_budget (userID, budgetID, lastUsed) VALUES ('${userID}','${budgetID}','1')`;
    const accountBudgetSQL = `INSERT INTO account_budget (accountID, budgetID) VALUES ('${accountID1}','${budgetID}'),('${accountID2}','${budgetID}')`;
    const categoryBudgetSQL = `INSERT INTO category_budget (categoryID, budgetID) VALUES ('${catID1}','${budgetID}'),('${catID2}','${budgetID}')`;
    const subcategoryCategorySQL = `INSERT INTO subcategory_category (subcategoryID, categoryID) VALUES ('${subcatID1}','${catID1}'),('${subcatID2}','${catID1}'),('${subcatID3}','${catID2}'),('${subcatID4}','${catID2}')`;
    const allocationSubcategorySQL = `INSERT INTO allocation_subcategory (allocationID, subcategoryID) VALUES ('${allocationID1}','${subcatID1}'),('${allocationID2}','${subcatID2}'),('${allocationID3}','${subcatID3}'),('${allocationID4}','${subcatID4}')`;

    connection.query(userBudgetSQL, (error, result) => {
        if (error) {
            console.log(`User-Budget linkage failed: ${error}`);
        } else {
            console.log('User-Budget linkage successful.');
        }
    });
    connection.query(accountBudgetSQL, (error, result) => {
        if (error) {
            console.log(`Account-Budget linkage failed: ${error}`);
        } else {
            console.log('Account-Budget linkage successful.');
        }
    });
    connection.query(categoryBudgetSQL, (error, result) => {
        if (error) {
            console.log(`Category-Budget linkage failed: ${error}`);
        } else {
            console.log('Category-Budget linkage successful.');
        }
    });
    connection.query(subcategoryCategorySQL, (error, result) => {
        if (error) {
            console.log(`Subcategory-Category linkage failed: ${error}`);
        } else {
            console.log('Subcategory-Category linkage successful.');
        }
    });
    connection.query(allocationSubcategorySQL, (error, result) => {
        if (error) {
            console.log(`Allocation-Subcategory linkage failed: ${error}`);
        } else {
            console.log('Allocation-Subcategory linkage successful.');
        }
    });
}