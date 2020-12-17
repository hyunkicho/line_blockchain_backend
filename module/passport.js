const LocalStrategy   = require('passport-local').Strategy;
const DB              = dicontainer.get( "DB" );
const pathUtil        = dicontainer.get( "pathUtil" );
const Err             = dicontainer.get( "Err" );
const crypto          = dicontainer.get( "crypto" );
const module_path     = pathUtil.basename( __filename )

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function(user, done) {
        console.log(user)
        done(null, user);
    });


    /* 로그인 전략 */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'usr_id',
        passwordField: 'usr_password',
        passReqToCallback : true
    }, 
    async function(req, usr_id, password, done) {
        console.log("들어옴1")
        var query = `SELECT /* ?.loginprocess */
                            usr_id,
                            usr_name,
                            usr_password,
                            usr_idx,
                            saltpass,
                            usr_address,
                            usr_state 
                        FROM member_info
                        WHERE usr_id = ? AND status = 'Y' `;
        let rows = await DB.Sql( query, [ module_path, usr_id ]);

        if(rows.length == 0){
            return done(null, false, req.flash('loginMessage', '아이디 또는 비밀번호가 틀렸습니다.'));
        }else{
            let pass = rows[0].usr_password;  // DB 해쉬값 참조
            let salt = rows[0].saltpass;  // DB 솔트값 참조
            let userHashPass = crypto.createHash("sha512").update(password+salt).digest("hex"); // 사용자 패스워드 + DB 솔트값

            if(pass === userHashPass){
                console.log('성공!');

                let userInfo = {
                    'usr_id' : usr_id,
                    'usernm' : rows[0].name,
                    'usr_state' : rows[0].usr_state === null? "": rows[0].usr_state,
                    'usr_idx' : rows[0].usr_idx,
                    'user_address' : usr_address,
                    'user_privateky' : usr_privatekey
                };
                return done(null, userInfo);
            }else{
                console.log('아이디 또는 비밀번호가 틀렸습니다.')
                return done(null, false, req.flash('loginMessage', '아이디 또는 비밀번호가 틀렸습니다.'));
            }
        }
    }
    ))


    /* 회원가입 전략 */
    passport.use('local-join', new LocalStrategy({
        usernameField: 'usr_id',
        passwordField: 'usr_password',
        passReqToCallback : true
    }, 
    async function(req, usr_id, usr_password, done) {
        console.log(req.body);
        let salt = Math.round((new Date().valueOf() * Math.random())) + "";
        let hashpass = crypto.createHash("sha512").update(usr_password+salt).digest("hex");
        var query = `SELECT /* ?.joinprocess */
                        usr_id
                        FROM member_info
                        WHERE usr_id = ? `;
        let Result = await DB.Sql( query, [ module_path, req.body.usr_id ]);
        
        if(Result.length){
            console.log('중복된 아이디입니다.')
            return done(null, false, req.flash('error', '중복된 아이디입니다.'));
        }else{
            console.log('성공')
            let rb = req.body;
            let usr_id = rb.usr_id;
            let usr_idx = rb.usr_idx;
            let usr_name = usr_name;
            let usr_password = usr_password;
            let usr_address = usr_address;
            let usr_state = usr_state;
            let usr_email = usr_email;
            let usr_privatekey = usr_privatekey;
        

            var sql = `INSERT INTO user /* ?.joinprocess */
            (
                usr_idx, 
                usr_id, 
                usr_name, 
                usr_password, 
                usr_address, 
                usr_state, 
                usr_email, 
                usr_privatekey, 
                reg_id, 
                reg_time, 
                mod_id, 
                mod_time
            )
            VALUES(
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                current_timestamp,
                ?,
                current_timestamp,?);
            `;

            console.log(usr_id, hashpass, salt)
            let inresult = await DB.Sql( sql, [ module_path, usr_idx, userid, usr_name, usr_password, usr_address, usr_state, usr_email, usr_privatekey, userid, userid]);
            if(inresult.affectedRows == 1){
                var userInfo = {
                    'usr_id' : usr_id,
                    'usr_name' : usr_name,
                    'usr_idx' : inresult.insertId,
                    'user_address' : usr_address,
                    'user_privateky' : usr_privatekey
                };

                return done(null, userInfo)
            }else{
                console.log('inresult error');
            }

        }
    }
    ))
}
