


IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'IsActive' 
	AND Object_ID = Object_ID(N'rmh.ServiceAgencyApplication'))
	BEGIN
		PRINT 'creating ColumnName IsActive'	
		ALTER TABLE rmh.ServiceAgencyApplication
			ADD IsActive bit not null DEFAULT 1
	END
