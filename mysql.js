const mysql = require('mysql');

module.exports =
    {
        handle: null,
        connect: function (call) {
            this.handle = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'blackgoldrp'
            });

            this.handle.connect(function (err) {
                if (err) {
                    switch (err.code) {
                        case "ECONNREFUSED":
                            console.log("\x1b[93m[MySQL] \x1b[97mError: Check your connection details (packages/mysql/mysql.js) or make sure your MySQL server is running. \x1b[39m");
                            break;
                        case "ER_BAD_DB_ERROR":
                            console.log("\x1b[91m[MySQL] \x1b[97mError: The database name you've entered does not exist. \x1b[39m");
                            break;
                        case "ER_ACCESS_DENIED_ERROR":
                            console.log("\x1b[91m[MySQL] \x1b[97mError: Check your MySQL username and password and make sure they're correct. \x1b[39m");
                            break;
                        case "ENOENT":
                            console.log("\x1b[91m[MySQL] \x1b[97mError: There is no internet connection. Check your connection and try again. \x1b[39m");
                            break;
                        default:
                            console.log("\x1b[91m[MySQL] \x1b[97mError: " + err.code + " \x1b[39m");
                            break;
                    }
                } else {
                    console.log("\x1b[92m[MySQL] \x1b[97mConnected Successfully \x1b[39m");
                }
            });
        },
        getEquippedItems: async function (player) {
            return new Promise(((resolve, reject) => {
                let queryStr = "SELECT * FROM items WHERE user_id = ? AND equip = ?";
                this.handle.query(queryStr, [player.uniqueId, true], function (err, result) {
                    if (err) reject(err);
                    console.log(`\x1b[92m[MySQL] \x1b[97mUpdate items \x1b[39m`);
                    resolve(result);
                });
            }));
        },
    };
