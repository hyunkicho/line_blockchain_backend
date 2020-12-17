const CommonConfig                 = dicontainer.get( "CommonConfig" );
const JSONResponse                 = require( './JSON-Response' );
const pathUtil                     = dicontainer.get( "pathUtil" );
const mysql2                       = require( 'mysql2/promise' );
const DataBasePool                 = mysql2.createPool( CommonConfig.Database );
let connection

async function Sql( Query, Param, res, callback = () => {} ) {
    try {
        connection = await DataBasePool.getConnection( function( err ) {
            if ( err ) {
                console.log(err)
                connection.release()
                console.error( pathUtil.basename( __filename ), " ", err );
                if ( res === undefined ) return
                return res.send( 200, JSONResponse.successFalse( 'Mysql Server Error.' ) );
            }
        })
        const [ Result ] = await connection.query( Query, Param, function ( err ) {
            if ( err ) {
                console.log(err)
                connection.release()
                console.error( pathUtil.basename( __filename ), " ", err );
                console.error( pathUtil.basename( __filename ), " ", JSON.stringify( 'Mysql Server Error.' ) );
                if ( res === undefined ) return
                return res.send( 200, JSONResponse.successFalse( 'Mysql Server Error.' ) );
            }
        })
        connection.release()
        return Result;
    } catch ( err ) {
        console.log(err)
        if (connection !== undefined && connection !== null) {
            connection.release()
            console.error( pathUtil.basename( __filename ), " ", err );
            throw new Error( JSON.stringify('Mysql Server Error.') )
        }
    }
}

async function Connection( res, callback = ()=>{}) {
    try {
        connection = await DataBasePool.getConnection( function( err ) {
            if ( err ) {
                connection.release()
                console.error( pathUtil.basename( __filename ), " ", err );
                throw err
            }
        })
        await callback(connection)
        connection.release()
    } catch ( err ) {
        if (connection !== undefined && connection !== null) {
            connection.release()
            console.error( pathUtil.basename( __filename ), " ", err );
            throw new Error( JSON.stringify('Mysql Server Error.') )
        }
    }
}

module.exports.Sql = Sql;
module.exports.Connection = Connection;