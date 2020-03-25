const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('querystring');
const iconv = require('iconv-lite');

const parseURLList = async () => {
  var urlList = [];
  let currentPage = 1;
  while (1) {
    const response = await axios.post('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult', qs.stringify({
      page: currentPage,
      sort: 'undefined',
      headers:{'content-type':'application/x-www-form-urlencoded'},
      request_id: '65d735289ed77565f95d90c43afe5398',
      responseType: "arraybuffer",
      responseEncoding: "binary"
    }));
    const { data, status } = response;
    const $ = cheerio.load(data);
    let end = true;
    $("div .single_libel a").each((index, value) => {
      end = false;
      urlList.push("https://www.maitresrestaurateurs.fr" + $(value).attr('href'));
      console.log($(value).attr('href') + "\n");
    });
    if(end == true) break;
    currentPage++;
  }
  return urlList;
};

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

axios.interceptors.response.use(response => {
  const ctype = response.headers["content-type"];
  if (ctype.includes("charset=windows-1252"))
    response.data = iconv.decode(response.data, "windows-1252");
  return response;
});

module.exports.scrapeURL = async url => {
  const response = await axios.post(url, qs.stringify({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    responseType: "arraybuffer",
    responseEncoding: "binary"
  }));
  const {data, status} = response;
  const $ = cheerio.load(data);

  if (status >= 200 && status < 300) {
    return parseURL($);
  }
};

const parseURL = $ => {

  console.log("\n");
  var adress = null;
  try{
    adress = $(".infos-complement a").attr('href').replace("https://www.google.com/maps/place/", '').replace(/\+/gi, ', ').replace('/', '');
  }
  catch(e){
    console.log(e);
  }
  console.log("\nAdresse = " + adress);
  const name = $(".infos-nom").text().replace(/\n/gi, '').trim();
  console.log("\nName = " + name);

  const restaurant = {
    name: name,
    adress: adress
  };

  return restaurant;
}