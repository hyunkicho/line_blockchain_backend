'use restrict'

const pathUtil                     = dicontainer.get( "pathUtil" );
let error_json

async function Handle( res, callback ) {
    try{
        await callback()
    }catch ( err ) {
        console.error( pathUtil.basename( __filename ).concat( " " ).concat( err ) );
        try {
            error_json = await require( "./JSON-Response").successFalse( JSON.parse(err.message) )
        }catch (err) {
            error_json = await require( "./JSON-Response").successFalse( { id:5001, message: err.message })
        }
        return res.send( 200, error_json );
    }
}
module.exports.Handle = Handle