/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            {
                name: "Yeasin Traders",
                companyType: "private",
                employeeCount: "400",
                countryOfOrigin: "Australia",
                companyReputation: "excellent",
                cashInFlow: "50000000",
                cashOutFlow: "10000000",

            },
            {
                name: "Partho Sharoti",
                companyType: "private",
                employeeCount: "100",
                countryOfOrigin: "US",
                companyReputation: "excellent",
                cashInFlow: "15000000",
                cashOutFlow: "5000000",
            },
            {
                name: "Naima Creation and Solution",
                companyType: "public",
                employeeCount: "50",
                countryOfOrigin: "Bangladesh",
                companyReputation: "good",
                cashInFlow: "200000",
                cashOutFlow: "10000",
            },
            {
                name: "Nabanix NGO",
                companyType: "ngo",
                employeeCount: "10",
                countryOfOrigin: "Uganda",
                companyReputation: "poor",
                cashInFlow: "150",
                cashOutFlow: "2",

            },
            {
                name: "Hanif Danif Caterings",
                companyType: "private",
                employeeCount: "250",
                countryOfOrigin: "India",
                companyReputation: "fair",
                cashInFlow: "1000000",
                cashOutFlow: "100000",
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'Company';
            await ctx.stub.putState('Company' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, id) {
        const carAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();  //Done group7
    }
    //async queryName(ctx, name) {
        //const carAsBytes = await ctx.stub.getState(name); // get the car from chaincode state
        //if (!carAsBytes || carAsBytes.length === 0) {
            //throw new Error(`${name} does not exist`);
        //}
        //console.log(carAsBytes.toString());
        //return carAsBytes.toString();  //Done group7
    //}

    async createCar(ctx, id, name, companyType, employeeCount, countryOfOrigin, companyReputation, cashInFlow, cashOutFlow) {
        console.info('============= START : Create Car ===========');

        const car = {
            name,
            docType: 'Company',
            companyType,
            employeeCount,
            countryOfOrigin,
            companyReputation,
            cashInFlow,
            cashOutFlow
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ==========='); //Done group 7
    }

    async queryAllCars(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx,id,name,companyType,employeeCount,countryOfOrigin) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(id); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.name = name;
        car.companyType = companyType;
        car.employeeCount = employeeCount;
        car.countryOfOrigin = countryOfOrigin;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
