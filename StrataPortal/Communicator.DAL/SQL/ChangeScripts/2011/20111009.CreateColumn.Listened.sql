


IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'Listened' 
	AND Object_ID = Object_ID(N'rmh.AgencyApplication'))
	BEGIN
		PRINT 'creating Listened column'	
		ALTER TABLE rmh.AgencyApplication
			ADD Listened datetime null
	END
ELSE
	PRINT 'Listened already exists on the table'
	
	