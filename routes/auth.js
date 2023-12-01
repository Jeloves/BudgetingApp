import express from 'express';
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto';
import { connection } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import { failedUserVerification } from '../errors.js';

export const loginRouter = express.Router();

loginRouter.use(express.urlencoded({ extended: true }));

loginRouter.get('/', (request, result) => {
    result.render('auth');
});

loginRouter.post('/', passport.authenticate('local', {
    successRedirect: './budget',
    failureRedirect: '/'
}));

loginRouter.post('/signup', (request, result, next) => {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(request.body.password, salt, 310000, 32, 'sha256', function (error, hashedPassword) {
        if (error) {
            return next(error);
        } else {
            new Promise((resolve, reject) => {
                const userID = uuidv4();
                const sql = `INSERT INTO user (id,name,password,salt,email,date) VALUES (?,?,?,?,?,?)`;
                return connection.query(sql, [userID, request.body.username, hashedPassword, salt, request.body.email, new Date().toISOString().slice(0, 19).replace('T', ' ')], (error, result) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(userID);
                    }
                });
            }).then(
                (userID) => {
                    request.logIn(userID, (error) => {
                        if (error) { return next(error) }
                        result.end();
                    });
                },
                (error) => {
                    return next(error)
                }
            );
        }
    });
});

passport.use(new LocalStrategy(function verify(username, password, callback) {
    new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE name = '${username}'`;
        return connection.query(sql, (error, result) => {
            if (error) {
                return reject(error);
            } else if (result.length === 1) {
                return resolve(result[0]);
            } else {
                return reject(failedUserVerification);
            }
        });
    }).then(
        (user) => {
            crypto.pbkdf2(password, Buffer.from(user.salt, "utf-8"), 310000, 32, 'sha256', function (error, hashedPassword) {
                if (error) { return callback(error); }
                if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return callback(null, false, { message: failedUserVerification })
                }
                return callback(null, user.id);
            });
        },
        (error) => {
            if (error === failedUserVerification) {
                return callback(null, false, { message: failedUserVerification })
            } else {
                return callback(error);
            }
        }
    );
}));

passport.serializeUser(function (userID, callback) {
    process.nextTick(function () {
        callback(null, {id: userID})
    });
});

passport.deserializeUser(function (user, callback) {
    process.nextTick(function () {
        return callback(null, user);
    });
});

