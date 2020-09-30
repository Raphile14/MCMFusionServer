const Entries = require('./Entries.json');
const mmEntries = require('./StaycationEntries.json');
const {GoogleSpreadsheet} = require('google-spreadsheet');

module.exports = class VoteDatabase {
    constructor(cacheCategories, cacheEntries, shsVoters, cVoters, cacheMMEntries, cacheMMCategories){
        this.cacheCategories = cacheCategories;
        this.cacheEntries = cacheEntries;
        this.shsVoters = shsVoters;
        this.cVoters = cVoters;
        this.cacheMMEntries = cacheMMEntries;
        this.cacheMMCategories = cacheMMCategories;
        this.format = [["email", "name", "voted_team", "date"]];
        this.doc;
        this.judgeSheets = ["judging_fac", "judging_ss", "judging_vv", "judging_mm"]
    }
    // Initialize by Files
    async init() {
        //////////////////////////////////////
        // Access Google Drive Database
        //////////////////////////////////////
        this.doc = new GoogleSpreadsheet(process.env.GOOGLE_FILE_LINK);
        // use service account creds
        await this.doc.useServiceAccountAuth({
            client_email: (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
            private_key: ((process.env.GOOGLE_PRIVATE_KEY) || "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCp5mDnj5dX22D2\nhV40s+M+wbtDYUkSGmOUUVfBv40j3+55UKDuKKhqW4aLWuCtlB41N/Q9LOHa2Qsm\nGtVCR6DuoJyWmFnGu0eFlAAzcjVfRTniWItUqcYtl3qiIe9vH7FbzL6LTnvWU+wJ\neCJAqq2tLdTNG++zQrzJTGfJFjC3cre3ur8fwv/DehOLknaQ4vGAjDWjqrgiGWQI\n7nn5BHRh5D44rD+putfYA61u6BwSUH21igo69Ng4enadv0beYsExp7hvnz9DXhE3\nytYkjfj6cgfb7MbvjxwpH2SRi+JiklWx9+TcMMCLlxNK9S2IKsi0aNAjWlqFF2LT\nxnlqxQd9AgMBAAECggEAAYfCY+OOgx6S1k80nlHoE2OIVCuKQaaWMtRNIsDrowdi\noDO1ncXxxzKq2N98YMpFDJXdiWpTLUPBaECOnvzpLXndEmgt5G6nm5CBNFvSsKVK\nR66941XVVwmWjUmAw0xfexdL66vmmdm1dkJfc88PWgN5kR1izW3Y9URoabT29fgH\nqdoiNysSJ1phCCXF0yXuxmfgpLBdVRDxcgDFlehnOplx82xFrdt0pPOqlXHYXsiZ\nwj7zlvPQKLBoro7pGXerToxTV/FBjnBi5rVPyj2MqMkvG+FsSNcY3RxUVJBhrUqF\ntVemVoPP0Y3hNuB31x6DJaj6Fasm1bwE2/pEUljVYQKBgQDuSk08FYYy61VZnFBx\nFtlTl2VSgDpM0whZLkPTNtpWwwO9zNqhi1beq5atdUKXR4nkfO2UA1+JGrU4ta0R\nhDdp7/26btCFrU2yE/Eq2meBqKU//F+hbLPDPT83P9O4NO6NjbT3jWktYZEP/tHY\nBB7jqPY1AnIIpB8QdZe7UHORMQKBgQC2huLK2zB5ZPHGliKXfKh2hCAk2uy+0mUV\ni8XvRzjCEfFkrfzw8DtsfDfFryDOjFa8EZNh61drFmlx4BhBPpnaZKXVHwj36Gac\n2tA3NwIJilUst/xxgeki9+9WhX7Ql6GG43HcBPIw3ThKLd/5+NAmBYoMbchmT58H\nu8JHs+coDQKBgCGQR6ax5XAgo6n2kYIMVNooVfYz54JQqzlcgeMrM7/KwikmxJjC\ndp7wjk2qWZHTWsHbMt+JRhiasXHmbRUtiVybmCJ9X1Ok4G+3zV1a2/9wUK5djt6+\n3+cdJl1S2TB2DC/WCOphebIRrwwQuV/y3KL2do9q48MB0vpPheq1X0HRAoGAEzKa\ntfVZ4trAJz/xQXemDFkXPGkeT2+3nA2IcwNNr/PNLOaz3O+XgHCMOSmTTMYr9Tnw\nA3OKTUQdMRH92xbnfbXqT0ElY1W5PTQyhCwv9arsDHkJfzLHv5rOPI5r6SqZnaNc\nfWSzyHnsCrlKfnMyCV25yFbfpgsn0dtosrv0Sx0CgYAhXxw5RRJg504GGJ69lRGD\n7245mP3/ddoy+mafJBeBjJqaUy3gumzezEjsL5gwohJSvg5lCrg+bFIjVeNkhuv9\nXMSOw7n/1BZoKbC1VfCeTjYbuYZwvqMOG+nHeLNLFvc951A8Xz9OA6uUnJfxlctr\nA9NnUC/arulgANgToKc6jA==\n-----END PRIVATE KEY-----\n"),
        });
         // loads document properties and worksheets
        await this.doc.loadInfo();
        //////////////////////////////////////
        // Read Entries.json and MMEntries.json
        //////////////////////////////////////
        for (let key in Entries) {
            if (!this.cacheCategories.includes(Entries[key].category)) {
                this.cacheCategories.push(Entries[key].category);
            }
            this.cacheEntries[key] = {votes: [], data: Entries[key]};            
        }
        for (let key in mmEntries) {
            if (!this.cacheMMCategories.includes(mmEntries[key].category)) {
                this.cacheMMCategories.push(mmEntries[key].category);
            }
            this.cacheMMEntries[key] = {votes: [], data: mmEntries[key]};            
        }

        //////////////////////////////////////
        // Read Excel Database and Update Vote standing
        //////////////////////////////////////        
        for (let x in this.cacheCategories) {
            const sheet = this.doc.sheetsByIndex[this.cacheCategories.indexOf(this.cacheCategories[x])];
            const rows = await sheet.getRows();
            for (let y in rows) {
                this.cacheEntries[rows[y].voted_team].votes.push(rows[y].email);
                // Store votes to cache
                if (this.cacheCategories[x].includes("COLLEGE")) {
                    this.cVoters.push(rows[y].email);
                }
                else if (this.cacheCategories[x].includes("SHS")) {
                    this.shsVoters.push(rows[y].email);
                }                
            }    
            console.log("Sheet " + sheet.title + " loaded successfully");        
        }

        // console.log(mmEntries);
        // save to mm cache storage
        // console.log(this.doc.sheetCount);
        // const sheet = this.doc.sheetsByIndex[6];
        // console.log(sheet.title)
        // for (let x in this.judgeSheets) {
        //     console.log(this.judgeSheets[x]);
        //     const sheet = this.doc.sheetsById[this.judgeSheets[x]];
        //     console.log(sheet.title)
        //     // const rows = await sheet.getRows();
        //     for (let y in rows) {
        //         // this
        //     }
        //     console.log("Sheet " + sheet.title + " loaded successfully");  
        // }        
    }
    // async submitVote(data, io) {
    //     for (let x = 2; x < data.length; x++) {
    //         if (data[x].category.includes("SHS")) {
    //             this.shsVoters.push(data[0]);                
    //         }
    //         else if (data[x].category.includes("COLLEGE")) {
    //             this.cVoters.push(data[0]);
    //         }
    //         this.cacheEntries[data[x].team].votes.push(data[0]);

    //         // Save to Excel Database
    //         // Get date
    //         let today = new Date();
    //         let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //         // Append Data to sheet
    //         const sheet = this.doc.sheetsByIndex[this.cacheCategories.indexOf(data[x].category)];
    //         await sheet.addRow({email: data[0], name: data[1], voted_team: data[x].team, date: date});    
    //         io.emit("current", {name: data[x].team, score: this.cacheEntries[data[x].team].votes.length});
    //     }
    // }

    // Submit Judge Score
    // async submitScoreFAC(data) {        
    //     const sheet = this.doc.sheetsByIndex[6];
    //     await sheet.addRows(data);
    // }
    // async submitScoreSS(data) {        
    //     const sheet = this.doc.sheetsByIndex[7];
    //     await sheet.addRows(data);
    // }
    // async submitScoreVV(data) {        
    //     const sheet = this.doc.sheetsByIndex[8];
    //     await sheet.addRows(data);
    // }
    // async submitScoreMM(data) {        
    //     const sheet = this.doc.sheetsByIndex[9];
    //     await sheet.addRows(data);
    // }
}