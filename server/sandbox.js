/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre');
const fs = require('fs');

async function sandbox() {
  try {

    //const listRestaurantsBib = await michelin.get();

    //const listRestaurantMaitre = await maitre.get();

    const listRestaurantsBib = readJSON('Bib');

    const listRestaurantMaitre = readJSON('Maitre');

    var count = 1;

    listRestaurantsBib.forEach(rb => {
      listRestaurantMaitre.forEach(rm => {
        if (compare(rb, rm)) {
          console.log(count++);
          rb.maitre = true;
        }
      })
    });

    await writeBibIntoJson(listRestaurantsBib);

    //await writeMaitreIntoJson(listRestaurantMaitre);


    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

function writeBibIntoJson(restList) {
  fs.writeFileSync("./Bib.json", JSON.stringify(restList), 'utf8', function (err) {
    if (err) throw err;
    console.log('complete');
  }
  );
}

function writeMaitreIntoJson(restList) {
  fs.writeFileSync("./Maitre.json", JSON.stringify(restList), 'utf8', function (err) {
    if (err) throw err;
    console.log('complete');
  }
  );
}

function readJSON(url) {
  let rawdata = fs.readFileSync('./' + url + '.json');
  return JSON.parse(rawdata);
}

function compare(rb, rm) {
  var codePostRB = null;
  var codePostRM = null;
  if (rb.adress != null) codePostRB = rb.adress.split(',')[2].substr(1, 5);
  if (rm.adress != null) codePostRM = rm.adress.split(',')[2].substr(1, 5);

  var nameRB;
  var nameRM;

  if (rb.name.split(' ')[0].length <= 3) nameRB = rb.name.substr(rb.name.split(' ')[0].length + 1);
  else nameRB = rb.name;

  if (rm.name.split(' ')[0].length <= 3) nameRM = rm.name.substr(rm.name.split(' ')[0].length + 1);
  else nameRM = rm.name;

  nameRB = nameRB.toLowerCase().replace(/é/gi, 'e').replace(/è/gi, 'e').replace(/ê/gi, 'e').replace(/ù/gi, 'u').replace(/à/gi, 'a');
  nameRM = nameRM.toLowerCase().replace(/é/gi, 'e').replace(/è/gi, 'e').replace(/ê/gi, 'e').replace(/ù/gi, 'u').replace(/à/gi, 'a');

  var nameDistance = LevenshteinDistance(nameRB, nameRM);

  var nameSimilarity = ((Math.max(nameRB.length, nameRM.length) - nameDistance) / Math.max(nameRB.length, nameRM.length));

  var adressRB;
  var adressRM;

  if (rb.adress == null) adressRB = "";
  else adressRB = rb.adress;

  if (rm.adress == null) adressRM = "";
  else adressRM = rm.adress;

  adressRB = adressRB.toLowerCase().replace(/é/gi, 'e').replace(/è/gi, 'e').replace(/ê/gi, 'e').replace(/ù/gi, 'u').replace(/à/gi, 'a');
  adressRM = adressRM.toLowerCase().replace(/é/gi, 'e').replace(/è/gi, 'e').replace(/ê/gi, 'e').replace(/ù/gi, 'u').replace(/à/gi, 'a');


  var adressDistance = LevenshteinDistance(adressRB, adressRM + ", france");

  var adressSimilarity = ((Math.max(adressRB.length, adressRM.length) - adressDistance) / Math.max(adressRB.length, adressRM.length));

  if (codePostRB == codePostRM && adressSimilarity > 0.7 && nameSimilarity >= 0.5) {
    console.log(true);
    console.log(rb.name + " / " + rm.name + " : " + adressRB + " / " + adressRM +
      " adress similarity = " + adressSimilarity + " name similarity = " + nameSimilarity);
    //+ " max length = " + Math.max(nameRB.length, nameRM.length) + " nameRB = " + nameRB + " nameRM = " + nameRM
    return true;
  }
  else return false;
}

const [, , searchLink] = process.argv;

//sandbox('https://guide.michelin.com/fr/fr/ile-de-france/paris/restaurant/mamagoto');
sandbox();
//sandbox(searchLink);



function LevenshteinDistance(a, b) {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;

  var matrix = [];

  // increment along the first column of each row
  var i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};