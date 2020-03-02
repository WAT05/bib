/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const fs = require('fs');

async function sandbox () {
  try {
    const listRestaurants = await michelin.scrapeAllBib();
    console.log("YYYYYYYYYYYYYYYYYYYY\n\n")

    console.log(listRestaurants);

    await writeBibIntoJson(listRestaurants);

    /*fs.writeFile ("input.json", JSON.stringify(listRestaurants), 'utf8', function(err) {
      if (err) throw err;
      console.log('complete');
      }
    );*/

    /*fs.writeFile("output.json", json, 'utf8', function (err) {
      if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
   
      console.log("JSON file has been saved.");
    });*/

    console.log("YYYYYYYYYYYYYYYYYYYY\n\n")

    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function writeBibIntoJson(restList){
  fs.writeFileSync ("./Bib.json", JSON.stringify(restList), 'utf8', function(err) {
    if (err) throw err;
    console.log('complete');
    }
  );
}

const [,, searchLink] = process.argv;

//sandbox('https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/mamagoto');
sandbox();
//sandbox(searchLink);


