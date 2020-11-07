

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'Notes' 
	AND Object_ID = Object_ID(N'rmh.Hits'))
	BEGIN
		PRINT 'creating Notes column'	
		ALTER TABLE rmh.Hits
			ADD Notes varchar(32) null
	END
