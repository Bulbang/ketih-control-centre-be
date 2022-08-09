// db env templates for lambda index.ts

export const dbCreds = {
    MYSQLUSER: '${env:MYSQLUSER}',
    MYSQLPASSWORD: '${env:MYSQLPASSWORD}',
    MYSQLPORT: '${env:MYSQLPORT}',
    MYSQLHOST: '${env:MYSQLHOST}',
    MYSQLDATABASE: '${env:MYSQLDATABASE}',
}
