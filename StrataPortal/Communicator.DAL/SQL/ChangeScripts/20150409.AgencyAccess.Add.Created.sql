
/*
This is being added because Created is always useful when investigating issues.

Executed:
UAT 09.04.2015 MW
PROD 27.04.2015 mw
SUPPORT 18.05.2015 mw
*/

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'Created' 
	AND Object_ID = Object_ID(N'dbo.AgencyAccess'))
	BEGIN
		PRINT 'creating Created column'	
		ALTER TABLE rmh.AgencyAccess
			ADD Created datetimeoffset not null DEFAULT getutcdate()
	END

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'Created' 
	AND Object_ID = Object_ID(N'dbo.AgencyApplication'))
	BEGIN
		PRINT 'creating Created column'	
		ALTER TABLE rmh.AgencyApplication
			ADD Created datetimeoffset not null DEFAULT getutcdate()
	END
