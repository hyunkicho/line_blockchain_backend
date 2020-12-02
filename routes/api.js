var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const axios = require('axios').default;

const apikey = 'c27cd6d2-a256-4105-ba0f-65a9f754170a'
const secret = 'b6d6bbfc-d411-47c1-9eb4-28c513bf2a67';

// axios.defaults.baseURL = endpoint;

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
            // console.log(result);
            console.log(result.data.responseData)
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
    // let ownerWalletAddress = rb.ownerWalletAddress;
    // let contractId = rb.contractId;
    // let tokenType = rb.tokenType;
    // let tokenIdNname = rb.tokenIdNname;
    // let info = rb.info;
    // let toAddress = rb.toAddress;

    let walletAddress = "tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz";
    let ownerWalletAddress = walletAddress;
    let ownerWalletSecret = 'EzB5TnWhisTWEX7yTHs+CX+A/ryq07A13J/9FkwmOQI=';
    let contractId = '063aedae';
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



router.post('/transfer_nft/', async function(req,res,next){
    let walletAddress = "tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz";
    let walletSecret = 'EzB5TnWhisTWEX7yTHs+CX+A/ryq07A13J/9FkwmOQI=';
    let contractId = '063aedae';
    let tokenIndex = "00000001";
    let tokenType = "10000001";
    let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
    path = `/v1/wallets/${walletAddress}/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}/transfer`;
    // the request body should be added after keys are sorted in the ascending order.
    let txid = await callAPI('POST', path, {
        "walletSecret": walletSecret,
        "toAddress": toAddress
    });
   
    res.send({"txid":txid});
});

router.get('/mint_nft/', async function(req,res,next){
    // let rb = req.body;
    // let walletAddress = rb.walletAddress;
    // let ownerWalletSecret = rb.ownerWalletSecret;
    // let contractId = rb.contractId;
    // let tokenType = rb.tokenType;
    // let toAddress = rb.toAddress;
    // let qualityVerifier = rb.qualityVerifier;

   let walletAddress = "tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz";
   const ownerWalletAddress = walletAddress;
   const ownerWalletSecret = 'EzB5TnWhisTWEX7yTHs+CX+A/ryq07A13J/9FkwmOQI=';
   const contractId = '063aedae';
   const tokenType = 10000001;
   const toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
   const qualityVerifier = '조현기';
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

(async()=>{

    //1-1

    // let contractId = '063aedae';
    // let path= `/v1/item-tokens/${contractId}/non-fungibles`
    // await callAPI('GET',path);

    //1-2
    // let walletAddress = "tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz";
    // const ownerWalletAddress = walletAddress;
    // const ownerWalletSecret = 'EzB5TnWhisTWEX7yTHs+CX+A/ryq07A13J/9FkwmOQI=';
    // const contractId = '063aedae';
    // const tokenType = 10000001;
    // const tokenIdNname = 'Guarantee';
    // const info = '해당 제품은 000년 00월 00일에 발매된 제품으로 ~특징을 가지고 있습니다.';
    // const toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
    // path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
    // // the request body should be added after keys are sorted in the ascending order.
    // await callAPI('POST', path, {
    //     "ownerAddress": ownerWalletAddress,
    //     "ownerSecret": ownerWalletSecret,
    //     "name": tokenIdNname,
    //     "toAddress": toAddress,
    //     "meta" : info 
    // });
    //// 라인 로그인 API 붙일 때 to user id 사용


    // //1-3 
    // let contractId = '063aedae';
    // let tokenType = 10000001;
    // path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}`;
    // // the request body should be added after keys are sorted in the ascending order.
    // await callAPI('GET', path);

    //1-4 
    // let contractId = '063aedae';
    // let tokenType = 10000001;
    // let tokenIndex = '00000001';
    // path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}`;
    // // the request body should be added after keys are sorted in the ascending order.
    // await callAPI('GET', path);

    //1-5 
    // let walletAddress = "tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz";
    // const ownerWalletAddress = walletAddress;
    // const ownerWalletSecret = 'EzB5TnWhisTWEX7yTHs+CX+A/ryq07A13J/9FkwmOQI=';
    // const contractId = '063aedae';
    // const tokenType = 10000001;
    // const toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
    // const qualityVerifier = '조현기';
    // path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
    // // the request body should be added after keys are sorted in the ascending order.
    // await callAPI('POST', path, {
    //     "ownerAddress": ownerWalletAddress,
    //     "ownerSecret": ownerWalletSecret,
    //     "name": tokenIdNname,
    //     "toAddress": toAddress,
    //     // "toUserId" : toUserId, //라인 로그인 연동시 사용 가능
    //     "meta" : qualityVerifier
    // });


    // 4b-a) Retrieve service wallet transaction history
    // $ curl -v -X GET https://test-api.blockchain.line.me/v1/wallets/{walletAddress}/transactions?type=token/MsgMint \
    //     -H 'service-api-key: {API Key}' \
    //     -H 'nonce: {nonce}' \
    //     -H 'timestamp: {timestamp}' \
    //     -H 'signature: {signature}'
    // let walletAddress = 'tlink1l8ka6przt5wpkavxdm5vgjgns6gw0ad7ymsazz';
    // let path= `/v1/wallets/${walletAddress}/transactions?type=token/MsgMint`
    // await callAPI('GET', path);

    // b) Retrieve a transaction with txHash
    // curl -v -X GET https://test-api.blockchain.line.me/v1/transactions/{transaction_hash} \
    //     -H 'service-api-key: {API Key}' \
    //     -H 'nonce: {nonce}' \
    //     -H 'timestamp: {timestamp}' \
    //     -H 'signature: {signature}'
    // const transactionHash = 'E782A8C645BCB154D37E2641BD9216030E75EB4305698B3B7B3323C495E6ECAD'; // tx hash
    // path = `/v1/transactions/${transactionHash}`;
    // await callAPI('GET', path);

    // Step 2-2) Mint the non-fungible item token
    // curl -v -X GET https://test-api.blockchain.line.me/v1/item-tokens/{contractId}/non-fungibles/{tokenType}/mint \
    //     -H 'service-api-key: {API Key}' \
    //     -H 'nonce: {nonce}' \
    //     -H 'timestamp: {timestamp}' \
    //     -H 'signature: {signature}' \
    //     -d '
    //     {
    //         "ownerAddress": "{owner wallet address}",
    //         "ownerSecret": "{owner wallet secret}",
    //         "name": "{token id name}",
    //         "toAddress": "{to address}"
    //     }
    //     '

//     curl -v -X GET https://test-api.blockchain.line.me/v1/item-tokens/{contractId}/non-fungibles/{tokenType}/mint \
// -H 'service-api-key: {API Key}' \
// -H 'nonce: {nonce}' \
// -H 'timestamp: {timestamp}' \
// -H 'signature: {signature}' \
// -d '
// {
//     "ownerAddress": "{owner wallet address}",
//     "ownerSecret": "{owner wallet secret}",
//     "name": "{token id name}",
//     "toAddress": "{to address}"
// }
// '

    

})();

module.exports = router;