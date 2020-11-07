/****** Object:  Index [PK_AgentContent]    Script Date: 10/17/2011 17:29:49 ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[AgentContent]') AND name = N'UNQ_AgentContentId')
	ALTER TABLE [dbo].[AgentContent] DROP CONSTRAINT [UNQ_AgentContentId]
GO

/****** Object:  Index [PK_AgentContent]    Script Date: 10/17/2011 17:29:49 ******/
IF  EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[AgentContent]') AND name = N'PK_AgentContent')
	ALTER TABLE [dbo].[AgentContent] DROP CONSTRAINT [PK_AgentContent]
GO


/****** Object:  Index [PK_AgentContent]    Script Date: 10/17/2011 17:30:12 ******/
ALTER TABLE [dbo].[AgentContent] ADD  CONSTRAINT [PK_AgentContent] PRIMARY KEY CLUSTERED 
(
	[AgentContentId] ASC
)
GO
