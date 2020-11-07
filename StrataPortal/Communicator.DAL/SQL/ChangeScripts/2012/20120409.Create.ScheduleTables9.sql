IF Not EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[ScheduleParameter]') AND name = N'IX_SceduleParam_ScheduleId')
Begin
	Create Index IX_SceduleParam_ScheduleId On ScheduleParameter (ScheduleId)
End
