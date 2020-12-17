var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const axios = require('axios').default;


const CommonConfig = dicontainer.get( "CommonConfig" );
const apikey = CommonConfig.Blockchain.apikey;
const secret = CommonConfig.Blockchain.secret;
const ownerWalletAddress = CommonConfig.Blockchain.ownerWalletAddress;
const ownerWalletSecret = CommonConfig.Blockchain.ownerWalletSecret;
const contractId_product = CommonConfig.Blockchain.contractId_product;
const contractId_validator = CommonConfig.Blockchain.contractId_validator;

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


router.get('/list_all_nft/', async function(req,res,next){
    // let rb = req.body;
    // let contractId = rb.contractId;
    let contractId = '063aedae';
    let path= `/v1/item-tokens/${contractId}/non-fungibles`
    await callAPI('GET',path);
    // res.render() 추가해야 합니다!
});

router.post('/create_nft/', async function(req,res,next){
    // let rb = req.body;
    // let walletAddress = rb.walletAddress;
    // let contractId = rb.contractId;
    // let tokenType = rb.tokenType;
    // let tokenIdNname = rb.tokenIdNname;
    // let info = rb.info;
    // let toAddress = rb.toAddress;

    let tokenType = 10000001;
    let tokenIdNname = 'Guarantee';
    let info = '해당 제품은 000년 00월 00일에 발매된 제품으로 ~특징을 가지고 있습니다.';
    let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
    // the request body should be added after keys are sorted in the ascending order.
    await callAPI('POST', path, {
        "ownerAddress": ownerWalletAddress,
        "ownerSecret": ownerWalletSecret,
        "name": tokenIdNname,
        "toAddress": toAddress,
        "meta" : info 
    });
    // res.send() //추가!!
    // 라인 로그인 API 붙일 때 to user id 사용
});

router.get('/retreive_nft/', async function(req,res,next){
    // let rb = req.body;
    // let contractId = rb.contractId;
    // let tokenType = rb.tokenType;

    let contractId = '063aedae';
    let tokenType = 10000001;
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}`;
    // the request body should be added after keys are sorted in the ascending order.
    await callAPI('GET', path);
});

router.get('/retreive_nft_one/', async function(req,res,next){
    // let rb = req.body;
    // let contractId = rb.contractId;
    // let tokenType = rb.tokenType;

    let contractId = '063aedae';
    let tokenType = 10000001;
    let tokenIndex = req.body.tokenIndex;
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}`;
    // the request body should be added after keys are sorted in the ascending order.
    await callAPI('GET', path);
});



router.post('/transfer_nft/', async function(req,res,next){
    let walletAddress = "tlink14d9ycnwqa975d4fmpfw35u6cnp89redkfm7rpp"; //tokenholder01 
    let walletSecret = 'WbQxvP81vdbTanATMH6cpc/ZHGN/FCkHY60AHFUBpRo='; //tokenholder01
    let tokenIndex = "00000018";
    let tokenType = "10000001";
    let toAddress = "tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz"; //linewallet
    path = `/v1/wallets/${walletAddress}/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}/transfer`;
    // the request body should be added after keys are sorted in the ascending order.
    let txid = await callAPI('POST', path, {
        "walletSecret": walletSecret,
        "toAddress": toAddress
    });
   console.log(txid)
    res.send({"txid":txid});
});

router.post('/transfer_nft2/', async function(req,res,next){
    let walletAddress = "tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz";//linewallet
    let walletSecret = 'EzB5TnWhisTWEX7yTHs+CX+A/ryq07A13J/9FkwmOQI=';//linewallet
    let tokenIndex = "00000018";
    let tokenType = "10000001";
    let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";//test user 1 
    path = `/v1/wallets/${walletAddress}/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}/transfer`;
    // the request body should be added after keys are sorted in the ascending order.
    let txid = await callAPI('POST', path, {
        "walletSecret": walletSecret,
        "toAddress": toAddress
    });
    console.log(txid)
    res.send({"txid":txid}); //test용으로 다시 돌려받기
});

router.get('/mint_nft/', async function(req,res,next){ //판매자가 최초로 신발 등록했을 때
    // let rb = req.body;
    // let tokenType = rb.tokenType;
    // let toAddress = rb.toAddress;
    // let qualityVerifier = rb.qualityVerifier;

   let tokenType = 10000001;
   let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
   let qualityVerifier = '검수자:조현기';
   let contractId = contractId_product;
   let tokenIdNname = 'Nike-dsfe1';
   path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
   // the request body should be added after keys are sorted in the ascending order.
   await callAPI('POST', path, {
       "ownerAddress": ownerWalletAddress,
       "ownerSecret": ownerWalletSecret,
       "name": tokenIdNname,
       "toAddress": toAddress,
       // "toUserId" : toUserId, //라인 로그인 연동시 사용 가능
       "meta" : qualityVerifier
   });
});

router.get('/mint_nft2/', async function(req,res,next){ //검수자 활동내역 인증할 때
    // let rb = req.body;
    // let tokenType = rb.tokenType;
    // let toAddress = rb.toAddress;
    // let qualityVerifier = rb.qualityVerifier;

   let tokenType = 10000001;
   let toAddress = "tlink19wrsts9ypttu00z8ujm3rq409chzhq5rktx98c";
   let validator_mail = 'avd@blimit.com';
   let contractId = contractId_validator;
   let tokenIdNname = '조현기';

   path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
   // the request body should be added after keys are sorted in the ascending order.
   await callAPI('POST', path, {
       "ownerAddress": ownerWalletAddress,
       "ownerSecret": ownerWalletSecret,
       "name": tokenIdNname,
       "toAddress": toAddress,
       // "toUserId" : toUserId, //라인 로그인 연동시 사용 가능
       "meta" : validator_mail
   });
});

module.exports = router;