var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const axios = require('axios').default;

////////////////////////////Config///////////////////////////////////

const CommonConfig = dicontainer.get( "CommonConfig" );
const apikey = CommonConfig.Blockchain.apikey_validator;
const secret = CommonConfig.Blockchain.secret_validator;
const ownerWalletAddress = CommonConfig.Blockchain.ownerWalletAddress_validator;
const ownerWalletSecret = CommonConfig.Blockchain.ownerWalletSecret_validator;
const contractId = CommonConfig.Blockchain.contractId_validator_servicetoken;


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


/////////////////////////REST API -POST//////////////////////

router.post('/mint_validator_service_token/', async function(req,res,next){ //검증인 ID 최초 생성
    
    let toAddress = ownerWalletAddress;
    let amount = "1000";
    path = `/v1/service-tokens/${contractId}/mint`;
    // the request body should be added after keys are sorted in the ascending order.
    let data = await callAPI('POST', path, {
        "toAddress": toAddress,
        "amount": amount,
        "ownerAddress": ownerWalletAddress,
        "ownerSecret": ownerWalletSecret
    });
 });

router.post('/burn_validator_service_token/', async function(req,res,next){
    // let walletAddress = ; 받는 사람 주소 넣기.
    path  = `/v1/service-tokens/${contractId}/burn`
    let data = await callAPI('POST', path, {
        "amount": amount,
        "ownerAddress": ownerWalletAddress,
        "ownerSecret": ownerWalletSecret
    });
} )

//즉시실행 테스트
// (async function () { 
    
// })()

module.exports = router;