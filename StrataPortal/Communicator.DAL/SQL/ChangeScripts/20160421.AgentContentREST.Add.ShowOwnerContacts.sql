
-- run against UAT 20160421 mw
-- run against PROD todo
-- run against SUPPORT todo

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ShowOwnerContacts' AND Object_ID = Object_ID(N'dbo.AgentContentREST'))
	BEGIN
		PRINT 'creating ShowOwnerContacts column'	
		ALTER TABLE dbo.AgentContentREST 
			ADD ShowOwnerContacts bit not null DEFAULT 0
	END