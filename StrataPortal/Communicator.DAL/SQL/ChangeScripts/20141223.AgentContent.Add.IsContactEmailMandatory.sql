
/*
Executed:
UAT 23.12.2014 MW

*/

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'IsContactEmailMandatory' 
	AND Object_ID = Object_ID(N'dbo.AgentContent'))
	BEGIN
		PRINT 'creating IsContactEmailMandatory column'	
		ALTER TABLE dbo.AgentContent
			ADD IsContactEmailMandatory bit not null DEFAULT 0
	END
