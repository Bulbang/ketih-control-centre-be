// db env templates for lambda index.ts

export const dbCreds = {
    MYSQLUSER: '${env:MYSQLUSER}',
    MYSQLPASSWORD: '${env:MYSQLPASSWORD}',
    MYSQLPORT: '${env:MYSQLPORT}',
    MYSQLHOST: '${env:MYSQLHOST}',
    MYSQLDATABASE: '${env:MYSQLDATABASE}',
}

export const mockDbCreds = {
    MYSQLUSER: '${env:MOCKMYSQLUSER}',
    MYSQLPASSWORD: '${env:MOCKMYSQLPASSWORD}',
    MYSQLPORT: '${env:MOCKMYSQLPORT}',
    MYSQLHOST: '${env:MOCKMYSQLHOST}',
    MYSQLDATABASE: '${env:MOCKMYSQLDATABASE}',
}
