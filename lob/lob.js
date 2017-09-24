const request = require("request-promise-native");
const keys = require("../config/keys");
const Lob = require("lob")({ apiKey: keys.LOB_API });
const fs = require("fs");

const lobFuncs = {
  fromAddress: reqBody => {
    let fromAddr = Lob.addresses.create({
      name: reqBody.name,
      address_line1: reqBody.addrLine1,
      address_line2: reqBody.addrLine2,
      address_city: reqBody.city,
      address_state: reqBody.state,
      address_zip: reqBody.zip,
      address_country: "US"
    });
    return fromAddr;
  },

  toAddress: async address => {
    let senator = await lobFuncs.parseGoogleCiv(address);

    let toAddr = Lob.addresses.create({
      name: senator.name,
      address_line1: senator.address[0].line1,
      address_city: senator.address[0].city,
      address_state: senator.address[0].state,
      address_zip: senator.address[0].zip,
      address_country: "US"
    });

    return toAddr;
  },

  parseGoogleCiv: async address => {
    address = address
      .trim()
      .split(" ")
      .join("%20");

    let url = `https://content.googleapis.com/civicinfo/v2/representatives?address=${address}&alt=json&key=${keys.GOOGLE_CIV}`;

    let res = await request(url, err => {
      if (err) {
        console.log(err);
      }
    });

    let officials = JSON.parse(res).officials;

    //skipping donald trump, mike pence and grabbing first senator on list
    //with the given address
    return officials[2];
  },

  createLetter: async (fromAddr, toAddr, message) => {
    let file = fs.readFileSync(__dirname + "/html/letter.html").toString();

    let letter = await Lob.letters.create({
      description: "Lob Coding Challenge",
      to: toAddr.id,
      from: fromAddr.id,
      file: file,
      merge_variables: {
        message: message ? message : "No Message"
      },
      color: false
    });

    return letter;
  }
};

module.exports = lobFuncs;
