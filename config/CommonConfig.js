require( 'custom-env' ).env( true );

CommonConfig = {};

CommonConfig.Database = {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    // waitForConnection: false,
    connectionLimit: 100,
    multipleStatements:true,
    timezone: '+00:00'
};

CommonConfig.Blockchain={
    apikey_product: process.env.apikey_product,
    secret_product: process.env.secret_product,
    ownerWalletSecret_product: process.env.ownerWalletSecret_product,
    ownerWalletAddress_product: process.env.ownerWalletAddress_product,
    contractId_product: process.env.contractId_product,
    apikey_validator: process.env.apikey_validator,
    secret_validator: process.env.secret_validator,
    ownerWalletSecret_validator: process.env.ownerWalletSecret_validator,
    ownerWalletAddress_validator: process.env.ownerWalletAddress_validator,
    contractId_validator: process.env.contractId_validator
}

module.exports = CommonConfig;