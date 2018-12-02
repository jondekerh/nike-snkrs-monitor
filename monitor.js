const request = require('request');
const rp = require('request-promise');
const discord = require('discord-bot-webhook');
const nikeURLs = [
  'https://api.nike.com/product_feed/threads/v2/?anchor=0&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom',
  'https://api.nike.com/product_feed/threads/v2/?anchor=50&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom',
  'https://api.nike.com/product_feed/threads/v2/?anchor=100&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom',
  'https://api.nike.com/product_feed/threads/v2/?anchor=150&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom'
];

var cycle = 0; //dont change this
var refreshDelay = 300000; //default is 5 mins, feel free to change
var currentStock = [];
var newStock = [];


function monitor() {

  var completeArr = [];

  rp.get(nikeURLs[0])
  .then((body) => {
    console.log('first!')
    let json = JSON.parse(body);
    try {
      for (x in json.objects) {
        if(!json.objects[x].publishedContent.properties.custom.restricted) {
          completeArr.push(json.objects[x]);
        }
      }
    } catch(ex) {
      console.log(ex)
      console.log('this shouldn\'t be an issue, moving on...')
    }
    console.log(completeArr.length);
  })
  .then(() => {
    return rp.get(nikeURLs[1]);
  })
  .then((body) => {
    console.log('second!')
    let json = JSON.parse(body);
    try {
      for (x in json.objects) {
        if(!json.objects[x].publishedContent.properties.custom.restricted) {
          completeArr.push(json.objects[x]);
        }
      }
    } catch(ex) {
      console.log(ex)
      console.log('this shouldn\'t be an issue, moving on...')
    }
    console.log(completeArr.length);
  })
  .then(() => {
    return rp.get(nikeURLs[2]);
  })
  .then((body) => {
    console.log('third!')
    let json = JSON.parse(body);
    try {
      for (x in json.objects) {
        if(!json.objects[x].publishedContent.properties.custom.restricted) {
          completeArr.push(json.objects[x]);
        }
      }
    } catch(ex) {
      console.log(ex)
      console.log('this shouldn\'t be an issue, moving on...')
    }
    console.log(completeArr.length);
  })
  .then(() => {
    return rp.get(nikeURLs[3]);
  })
  .then((body) => {
    console.log('fourth!')
    let json = JSON.parse(body);
    try {
      for (x in json.objects) {
        if(!json.objects[x].publishedContent.properties.custom.restricted) {
          completeArr.push(json.objects[x]);
        }
      }
    } catch(ex) {
      console.log(ex)
      console.log('this shouldn\'t be an issue, moving on...')
    }
    console.log(completeArr.length);
  })
  .catch ((err) => {
    console.log(err);
  })
  return completeArr;
};

console.log(monitor());
