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
    apikey: process.env.apikey,
    secret: process.env.secret,
    ownerWalletSecret: process.env.ownerWalletSecret,
    ownerWalletAddress: process.env.ownerWalletAddress,
    contractId: process.env.contractId
}

module.exports = CommonConfig;