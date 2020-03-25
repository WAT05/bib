const axios = require('axios');
const cheerio = require('cheerio');


module.exports.get = async () => {
  const urlList = await parseURLList();
  var restList = [];
  let i = 1;
  for (url of urlList) {
    restList.push(await this.scrapeURL(url));
    console.log(url + "\n" + i + "\n")
    i++;
  }
  return restList;
};

const parseURLList = async () => {
  const urlList = [];
  for (let i = 1; i <= 15; i++){
    const response = await axios("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/" + i);
    const { data, status } = response;
    const $ = cheerio.load(data);
    $(".link").each((index, value) => {
      urlList.push("https://guide.michelin.com" + $(value).attr('href'));
    });
  }
  return urlList;
};

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */

  const parseURL = $ => {
    //const $ = cheerio.load(data);
    const name = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > h2').text();
    var adress = $('.fa-map-marker-alt').closest('li').text();
    adress = adress.slice(0, adress.length / 2);
    
    const priceAndType = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li.restaurant-details__heading-price').text();
    const price = priceAndType.split('•')[0].replace(/ /gi, '').replace(/\n/gi, '');
    const type = priceAndType.split('•')[1].replace(/\n/gi, '').trim();

    const image = $('.masthead__gallery-image-item').attr('data-image');

    const phone = $('.link').attr('href');
    const website = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(4) > div.row > div:nth-child(1) > div > div.collapse__block-item.link-item > a').attr('href');
    const experience = $('#experience-section > ul > li:nth-child(2)').text().replace(/ó/gi, '').replace(/ò/gi, '').replace(/\n/gi, '').trim();

    const restaurant = {
      image: image,
      name: name,
      adress: adress,
      price: price,
      type: type,
      phone: phone,
      website:website,
      experience: experience,
      maitre: false
    };
    console.log(restaurant.name + " " + restaurant.adress + "\n");

    console.log(restaurant.name + " " + restaurant.image + "\n");
    return restaurant;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeURL = async url => {
  const response = await axios(url);
  const {data, status} = response;
  const $ = cheerio.load(data);

  if (status >= 200 && status < 300) {
    return parseURL($);
  }

  console.error(status);

  return null;
};
