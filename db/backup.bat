@echo off
set year=%DATE:~6,4%
set month=%DATE:~3,2%
set day=%DATE:~0,2%
set hour=%TIME:~0,2%
set minute=%TIME:~3,2%
set backuptime=%year%%month%%day%%hour%%minute%
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump" -u root heroku_43e6ebe3dd474ec --databases --column-statistics=0 -h localhost --password=M1a4$1t4E8r0 > "%backuptime%".sql
exit