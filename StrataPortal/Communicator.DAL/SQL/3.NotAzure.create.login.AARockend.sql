
-- NOTE: Create the RestCentral database first!

/****** CANNOT be run on AZURE! ******/
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = N'AARockend')
	PRINT 'Login [AARockend] already exists'
ELSE
	CREATE LOGIN [AARockend] WITH PASSWORD=N'D1am0nd!', 
		DEFAULT_DATABASE=[RestCentral], 
		DEFAULT_LANGUAGE=[British], 
		CHECK_EXPIRATION=OFF, 
		CHECK_POLICY=OFF
GO

EXEC sys.sp_addsrvrolemember @loginame = N'AARockend', @rolename = N'sysadmin'
GO


