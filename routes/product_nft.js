var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const axios = require('axios').default;

////////////////////////////Config///////////////////////////////////

const CommonConfig = dicontainer.get( "CommonConfig" );
const apikey = CommonConfig.Blockchain.apikey_product;
const secret = CommonConfig.Blockchain.secret_product;
const ownerWalletAddress = CommonConfig.Blockchain.ownerWalletAddress_product;
const ownerWalletSecret = CommonConfig.Blockchain.ownerWalletSecret_product;
const contractId = CommonConfig.Blockchain.contractId_product;


////////////////////////////sign TX///////////////////////////////////
function jsonToQueryString(json, path) {
    if (json && Object.keys(json).length > 0) {
        return (path.indexOf('?') == -1 ? '?' : '&') +
            Object.keys(json).map(function (key) {
                // return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
                return key + '=' + json[key];
            }).join('&');
    } else {
        return '';
    }

}

async function callAPI(method, path, params) {
    const nonce = crypto.randomBytes(16).toString('hex').slice(4, 12);
    const timestamp = Date.now();

    const orderedParams = {};
    if (params) {
        Object.keys(params).sort().forEach(function(key) {
            orderedParams[key] = params[key];
        });
    }

    const signatureBase = `${nonce}${timestamp}${method}${path}${jsonToQueryString(orderedParams, path)}`;
    // console.log(signatureBase);

    const signature = crypto.createHmac('sha512', secret)
        .update(signatureBase)
        .digest('base64');

    // console.log(signature);

    const headers = {
        'service-api-key': apikey,
        'nonce': nonce,
        'timestamp': timestamp,
        'signature': signature

    };

    const config= {
        method: method,
        url: path,
        baseURL: "https://test-api.blockchain.line.me", 
        headers: headers,
        data: orderedParams
    };

    try {
        let result = await axios.request(config);
            console.log("성공",result.data.responseData)
            return result.data.responseData;
    } catch (err) {
        if (err.response) {
            console.error(err.response.status, err.response.statusText);
            console.log(err.response.data);
            console.log(err.response.headers);
            console.log(err.response.config);
        } else {
            console.log(err);
        }
    }
}
/////////////////////////REST API -get//////////////////////



router.get('/retreive/', async function(req,res,next){
    let tokenType = 10000001; //추후 대분류 (제품별 분류)에 사용
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}`;
    // the request body should be added after keys are sorted in the ascending order.
    let raw_data = await callAPI('GET', path);
    console.log(raw_data)
    let data = raw_data.token[0];
    res.send({"data": data});
});



// router.get('/list_all_nft/', async function(req,res,next){ //전체 보증서/상품 검색
//     // let rb = req.body;
//     // let contractId = rb.contractId;
//     let contractId = '063aedae';
//     let path= `/v1/item-tokens/${contractId}/non-fungibles`
//     let data = await callAPI('GET',path);
//     res.send({"data": data});
// });

//----------------- 특정 토큰 상세 검색 ----------------------------------
// router.get('/retreive_prodcut_nft_one/', async function(req,res,next){
//     // let rb = req.body;
//     // let contractId = rb.contractId;
//     // let tokenType = rb.tokenType;

//     let contractId = contractId_product;
//     let tokenType = 10000001;
//     let tokenIndex = req.body.tokenIndex;
//     path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}`;
//     // the request body should be added after keys are sorted in the ascending order.
//     await callAPI('GET', path);
// });
//-----------------------------------------------------------------------


/////////////////////////REST API -POST//////////////////////

router.post('/mint/', async function(req,res,next){ //판매자가 최초로 신발 등록했을 때
   let rb = req.body;
   let tokenType = "10000001";
   let price = rb.price;
   let validator = "Cho hyun ki";
   let qualityVerifier = `Price : ${price} , Validator : ${validator}`;
   let tokenIdNname = 'Nike-dsfe1';
   path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
   // the request body should be added after keys are sorted in the ascending order.
   let data = await callAPI('POST', path, {
       "ownerAddress": ownerWalletAddress,
       "ownerSecret": ownerWalletSecret,
       "name": tokenIdNname,
       "toAddress": ownerWalletAddress,
       // "toUserId" : toUserId, //라인 로그인 연동시 사용 가능
       "meta" : qualityVerifier
   });
   res.send({"data":data , "price": price , "validator" :validator });
});


router.post('/transfer/', async function(req,res,next){ //추후 DB를 통해 제품별 가격변동 내역과 증거물인 txid를 저장
    // let walletAddress = "tlink14d9ycnwqa975d4fmpfw35u6cnp89redkfm7rpp"; //tokenholder01 
    // let walletSecret = 'WbQxvP81vdbTanATMH6cpc/ZHGN/FCkHY60AHFUBpRo='; //tokenholder01
    let walletAddress = ownerWalletAddress;  
    let walletSecret = ownerWalletSecret; 
    let tokenIndex = "000000b1";
    let tokenType = "10000001";
    let toAddress = "tlink14d9ycnwqa975d4fmpfw35u6cnp89redkfm7rpp"; 
    path = `/v1/wallets/${walletAddress}/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}/transfer`;
    // the request body should be added after keys are sorted in the ascending order.
    let txid = await callAPI('POST', path, {
        "walletSecret": walletSecret,
        "toAddress": toAddress
    });
    
    let price = 3000;
    let validator = "Lee Sang Goo"
    let qualityVerifier = `Price : ${price} , Validator : ${validator}, txhash: ${txid.txHash}`;
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}`;
    let txid2 = await callAPI('PUT', path, {
        "meta" : qualityVerifier, 
        "ownerAddress": ownerWalletAddress,
        "ownerSecret": ownerWalletSecret
    });
    

    res.send({"txid":txid});
});


(async function () { 
   
})()


router.post('/transfer2/', async function(req,res,next){
    let walletAddress = "tlink14d9ycnwqa975d4fmpfw35u6cnp89redkfm7rpp";//tokenholder01
    let walletSecret = 'WbQxvP81vdbTanATMH6cpc/ZHGN/FCkHY60AHFUBpRo=';//tokenholder01
    let tokenIndex = "000000b1";
    let tokenType = "10000001";
    let toAddress = ownerWalletAddress;
    path = `/v1/wallets/${walletAddress}/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}/transfer`;
    // the request body should be added after keys are sorted in the ascending order.
    let txid = await callAPI('POST', path, {
        "walletSecret": walletSecret,
        "toAddress": toAddress
    });

    let price = 2400;
    let validator = "Silver Ash"
    let qualityVerifier = `Price : ${price} , Validator : ${validator}, txhash: ${txid.txHash}`;
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}`;
    let txid2 = await callAPI('PUT', path, {
        "meta" : qualityVerifier, 
        "ownerAddress": ownerWalletAddress,
        "ownerSecret": ownerWalletSecret
    });

    res.send({"txid":txid}); //test용으로 다시 돌려받기
});

// router.post('/create_nft/', async function(req,res,next){ //새로운 브랜드 제품 추가할 때
//     let tokenType = 10000001;
//     let tokenIdNname = 'Adidas_Series';
//     let info = '아디다스를 Blimit에서 만나보세요.';
//     let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
//     path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
//     // the request body should be added after keys are sorted in the ascending order.
//     let data = await callAPI('POST', path, {
//         "ownerAddress": ownerWalletAddress,
//         "ownerSecret": ownerWalletSecret,
//         "name": tokenIdNname,
//         "toAddress": toAddress,
//         "meta" : info 
//     });

//     res.send({"data":data});

// });







module.exports = router;