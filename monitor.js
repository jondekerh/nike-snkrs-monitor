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
var refreshDelay = 10000; //default is 10 mins (600000), feel free to change
var currentStock = [];
var newStock = [];

function findNewDrops(arr1, arr2) {
  var differences = [];
  var arr1Shallow = [];
  //make a shallow clone of arr1 with just the ids for easy lookups
  for (i in arr1) {
    arr1Shallow.push(arr1[i].id);
  };
  for (i in arr2) {
    if (!arr1Shallow.includes(arr2[i].id)) {
      differences.push(arr2[i]);
    }
  };
  return differences;
};

function updates(arr) {
  if (cycle === 0) {
    currentStock = arr;
    console.log('Initial scan complete, ' + currentStock.length + ' items found. Drops and restocks will be checked in the next cycle.');
    console.log(' ');
    cycle++;
  } else {
    newStock = arr;
    currentShallow = [];
    for (i in currentStock) {
      currentShallow.push(currentStock[i].id);
    };
    newStock = newStock.sort(function(a,b){
      return currentShallow.indexOf(a.id) - currentShallow.indexOf(b.id);
    });
    for (i in newStock) {
      if (!currentShallow.includes(newStock[i].id)) {
        newStock.push(newStock.shift());
      }
    };
    var newDrops = findNewDrops(currentStock, newStock);
      for (i in newDrops) {
        //post each new item to discord
      };
    console.log('Cycle ' + cycle + ' complete!');
    console.log(' ');
    console.log(currentStock[0]);
    console.log(currentStock[1]);
    console.log(currentStock[2]);
    console.log(newStock[0]);
    console.log(newStock[1]);
    console.log(newStock[2]);
    currentStock = newStock;
    newStock = [];
    cycle++;
  }
};


function monitor() {

  var completeArr = [];

  rp.get(nikeURLs[0])
  .then((body) => {
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
  })
  .then(() => {
    return rp.get(nikeURLs[1]);
  })
  .then((body) => {
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
  })
  .then(() => {
    return rp.get(nikeURLs[2]);
  })
  .then((body) => {
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
  })
  .then(() => {
    return rp.get(nikeURLs[3]);
  })
  .then((body) => {
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
    return completeArr;
  })
  .then ((completeArr) => {
    updates(completeArr);
  })
  .catch ((err) => {
    console.log(err);
  })
  setTimeout(() => {
    monitor();
  }, refreshDelay);
};

monitor();
