IF  Not EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[StaticSchedule]') AND name = N'IX_StaticSchedule_AppCode')
Begin
	Create Index IX_StaticSchedule_AppCode On StaticSchedule (ApplicationCode)
End
