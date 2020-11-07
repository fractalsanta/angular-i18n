IF  Not EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[Schedule]') AND name = N'IX_Schedule_AppKey')
Begin
	Create Index IX_Schedule_AppKey On Schedule (ApplicationKey)
End
