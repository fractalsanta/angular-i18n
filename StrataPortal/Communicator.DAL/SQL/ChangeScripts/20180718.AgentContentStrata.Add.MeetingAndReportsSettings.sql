
/*
Executed:
UAT 
 
*/

IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ShowReportsPageOwner' 
	AND Object_ID = Object_ID(N'dbo.AgentContentSTRATA'))
	BEGIN
		PRINT 'creating ShowReportsPageOwner column'	
		ALTER TABLE dbo.AgentContentSTRATA
			ADD ShowReportsPageOwner bit not null DEFAULT 1
	END

	IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ShowReportsPageCommitteeMember' 
	AND Object_ID = Object_ID(N'dbo.AgentContentSTRATA'))
	BEGIN
		PRINT 'creating ShowReportsPageCommitteeMember column'	
		ALTER TABLE dbo.AgentContentSTRATA
			ADD ShowReportsPageCommitteeMember bit not null DEFAULT 1
	END

	IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ShowMeetingsPageOwner' 
	AND Object_ID = Object_ID(N'dbo.AgentContentSTRATA'))
	BEGIN
		PRINT 'creating ShowMeetingsPageOwner column'	
		ALTER TABLE dbo.AgentContentSTRATA
			ADD ShowMeetingsPageOwner bit not null DEFAULT 1
	END

	IF NOT EXISTS(SELECT * FROM sys.columns WHERE name = N'ShowMeetingsPageCommitteeMember' 
	AND Object_ID = Object_ID(N'dbo.AgentContentSTRATA'))
	BEGIN
		PRINT 'creating ShowMeetingsPageCommitteeMember column'	
		ALTER TABLE dbo.AgentContentSTRATA
			ADD ShowMeetingsPageCommitteeMember bit not null DEFAULT 1

		--Update ShowMeetingsPageOwner and ShowMeetingsPageCommitteeMember to reflect the same value as the existing setting
		UPDATE AgentContentSTRATA 
		SET AgentContentStrata.ShowMeetingsPageCommitteeMember = AgentContent.StrataShowMeetings, 
			AgentContentStrata.ShowMeetingsPageOwner = AgentContent.StrataShowMeetings 
		FROM AgentContentSTRATA 
		INNER JOIN AgentContent ON AgentContentSTRATA.AgentContentId = AgentContent.AgentContentId 
	END

	