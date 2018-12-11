const request = require('request');
const rp = require('request-promise');
const discord = require('discord.js');
const discordInfo = require('./discord-info.json');
const nikeURLs = [
  'https://api.nike.com/product_feed/threads/v2/?anchor=0&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom',
  'https://api.nike.com/product_feed/threads/v2/?anchor=50&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom',
  'https://api.nike.com/product_feed/threads/v2/?anchor=100&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom',
  'https://api.nike.com/product_feed/threads/v2/?anchor=150&count=50&filter=marketplace%28US%29&filter=language%28en%29&filter=inStock%28true%29&filter=productInfo.merchPrice.discounted%28false%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&fields=active&fields=id&fields=lastFetchTime&fields=productInfo&fields=publishedContent.nodes&fields=publishedContent.properties.coverCard&fields=publishedContent.properties.productCard&fields=publishedContent.properties.products&fields=publishedContent.properties.publish.collections&fields=publishedContent.properties.relatedThreads&fields=publishedContent.properties.seo&fields=publishedContent.properties.threadType&fields=publishedContent.properties.custom'
];

//remember to rename your .json file!
const hook = new discord.WebhookClient(discordInfo.hookId, discordInfo.hookToken);


var cycle = 0; //dont change this
var refreshDelay = 300000; //default is 5 mins (300000), feel free to change
var currentStock = [];
var newStock = [];

function findRestocks(arr1, arr2) {
  var restocks = [];
  for (i in arr1) { //go through currentStock
    for (j in arr1[i].productInfo) { //go through each index in productInfo of current product
      for (k in arr1[i].productInfo[j].availableSkus) { //go through the availableSkus array for each index in productInfo
        if (arr1[i].productInfo[j].availableSkus[k] == null) {
          break;
        } else if (arr1[i].productInfo[j].availableSkus[k].available === false && arr2[i].productInfo[j].availableSkus[k].available == true) {
          restocks.push({
            "thumbnail": arr2[i].productInfo[j].imageUrls.productImageUrl,
            "name": arr2[i].productInfo[j].productContent.title,
            "color": arr2[i].productInfo[j].productContent.colorDescription,
            "size": arr2[i].productInfo[j].skus[k].nikeSize,
            "price": '$' + arr2[i].productInfo[j].merchPrice.currentPrice,
            "link": 'https://www.nike.com/launch/t/' + arr2[i].publishedContent.properties.seo.slug
          });
        }
      }
    }
  }
  return restocks;
};

function findNewDrops(arr2, shallowArr1) {
  var differences = [];
  for (i in arr2) {
    if (!shallowArr1.includes(arr2[i].id)) {
      differences.push({
        "thumbnail": arr2[i].productInfo[0].imageUrls.productImageUrl,
        "name": arr2[i].productInfo[0].productContent.title,
        "color": arr2[i].productInfo[0].productContent.colorDescription,
        "price": '$' + arr2[i].productInfo[0].merchPrice.currentPrice,
        "link": 'https://www.nike.com/launch/t/' + arr2[i].publishedContent.properties.seo.slug
      });
    }
  };
  return differences;
};

function updates(arr) {
  if (cycle === 0) {
    currentStock = arr;
    console.log('Initial scan complete, ' + currentStock.length + ' items found. Drops and restocks will be checked in the next cycle.');
    console.log(Date());
    console.log(' ');
    hook.send('Now watching Nike Snkrs!');
    cycle++;
  } else {
    newStock = arr;
    //create a shallow clone of currentStock with just IDs for easier sorting of newStock using the .sort method
    currentShallow = [];
    for (i in currentStock) {
      currentShallow.push(currentStock[i].id);
    };
    //sort newStock so that the indices of its IDs match those of currentStock
    newStock = newStock.sort(function(a,b){
      return currentShallow.indexOf(a.id) - currentShallow.indexOf(b.id);
    });
    //by default items not in currentStock are placed first in newStock with the above method
    //this method places them last
    for (i in newStock) {
      if (!currentShallow.includes(newStock[i].id)) {
        newStock.push(newStock.shift());
      }
    };
    //all this is done so that the indices of all items in both currentStock AND newStock match up,
    //which is the basis for how findRestocks() works without using a milliion nested for loops.
    //it still uses a lot of nested for loops though lol

    //find all the new items from this scan and post them
    var newDrops = findNewDrops(newStock, currentShallow);
    for (i in newDrops) {
      hook.send({
        embeds: [{
          color: 3447003,
          thumbnail: {
            'url': newDrops[i].thumbnail
          },
          title: 'NIKE SNKRS DROP',
          fields: [
            {
              name: 'Item:',
              value: newDrops[i].name
            },
            {
              name: 'Color:',
              value: newDrops[i].color
            },
            {
              name: 'Price:',
              value: newDrops[i].price
            },
            {
              name: 'Link:',
              value: newDrops[i].link
            }
          ]
        }]
      })
    };

    //find all restocks by size from this scan and post them
    var restockedItems = findRestocks(currentStock, newStock);
    for (i in restockedItems) {
      hook.send({
        embeds: [{
          color: 3447003,
          thumbnail: {
            'url': restockedItems[i].thumbnail
          },
          title: 'NIKE SNKRS RESTOCK',
          fields: [
            {
              name: 'Item:',
              value: restockedItems[i].name
            },
            {
              name: 'Color:',
              value: restockedItems[i].color
            },
            {
              name: 'Size:',
              value: restockedItems[i].size
            },
            {
              name: 'Price:',
              value: restockedItems[i].price
            },
            {
              name: 'Link:',
              value: restockedItems[i].link
            }
          ]
        }]
      })
    };

    console.log('Cycle ' + cycle + ' complete!');
    console.log(Date());
    console.log(' ');
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
      console.log(ex);
      console.log('this shouldn\'t be an issue, moving on...');
      //sometimes while I was building this it would attempt to scan an object that wasn't there, which
      //would throw an error and crash the whole thing. However the program can still go on despite this with
      //no issue, which is why this catch is here. It hasn't happened since production though.
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
      console.log(ex);
      console.log('this shouldn\'t be an issue, moving on...');
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
      console.log(ex);
      console.log('this shouldn\'t be an issue, moving on...');
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
      console.log(ex);
      console.log('this shouldn\'t be an issue, moving on...');
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
