


IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'LastLogin' 
	AND Object_ID = Object_ID(N'dbo.UserLogin'))
	BEGIN
		PRINT 'creating LastLogin column'	
		ALTER TABLE dbo.UserLogin
			ADD LastLogin datetime null 
	END
