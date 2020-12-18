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
const contractId = CommonConfig.Blockchain.contractId_validator;

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
    let tokenType = 10000001;//추후 대분류 (검증자 그룹별 분류)에 사용
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}`;
    // the request body should be added after keys are sorted in the ascending order.
    let raw_data = await callAPI('GET', path);
    let data = raw_data.token[0];
    res.send({"data": data});
});


//  router.get('/list_all_nft/', async function(req,res,next){ //검증자 전체리스트 조회 시
//     let path= `/v1/item-tokens/${contractId}/non-fungibles`
//     await callAPI('GET',path);
//     // res.render() 추가해야 합니다!
// });


/////////////////////////REST API -POST//////////////////////

router.post('/mint/', async function(req,res,next){ //검증인 ID 최초 생성

   let tokenType = 10000001;
   let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
   let validator_info = 'Speciality of : Nike,Adidas,Puma';
   let tokenIdNname = 'Nike-dsfe1';
   path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
   // the request body should be added after keys are sorted in the ascending order.
   let data = await callAPI('POST', path, {
       "ownerAddress": ownerWalletAddress,
       "ownerSecret": ownerWalletSecret,
       "name": tokenIdNname,
       "toAddress": toAddress,
       "meta" : validator_info
   });
   res.send({"data":data});
});


// router.post('/create_nft/', async function(req,res,next){
//     let tokenType = 10000001;
//     let tokenIdNname = 'Team0221';
//     let info = '신발전문 검증자들로 구성되어 있습니다.';
//     let toAddress = "tlink1tefs8lma3zwcsxl4qa4gq0r8fqvm30qh8jdem2";
//     path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
//     // the request body should be added after keys are sorted in the ascending order.
//     await callAPI_product('POST', path, {
//         "ownerAddress": ownerWalletAddress,
//         "ownerSecret": ownerWalletSecret,
//         "name": tokenIdNname,
//         "toAddress": toAddress,
//         "meta" : info 
//     });
//     // res.send() //추가!!
//     // 라인 로그인 API 붙일 때 to user id 사용
// });

// (async function () { 
//     let tokenType = 10000001;
//     let validator_info = 'Speciality of : Nike,Adidas,Puma';
//     let tokenIdNname = 'chohyunki';
//     path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
//     // the request body should be added after keys are sorted in the ascending order.
//     let data = await callAPI('POST', path, {
//         "ownerAddress": ownerWalletAddress,
//         "ownerSecret": ownerWalletSecret,
//         "name": tokenIdNname,
//         "toAddress": ownerWalletAddress,
//         "meta" : validator_info
//     });
//  })()



module.exports = router;