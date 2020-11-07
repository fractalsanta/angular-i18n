
Create Role RockendRole
Grant Execute, Select, Insert, Update, Delete To RockendRole
exec sp_addrolemember 'RockendRole', 'rockend'
Go