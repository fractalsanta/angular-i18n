
IF  EXISTS (SELECT * FROM sys.database_principals WHERE name = N'rockend')
	PRINT 'USER [rockend] already exists'
ELSE
	CREATE USER [rockend] FOR LOGIN [AARockend] 
GO


