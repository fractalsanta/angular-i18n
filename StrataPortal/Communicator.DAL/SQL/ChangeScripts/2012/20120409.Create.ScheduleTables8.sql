IF  Not EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ScheduleParameter]') AND type in (N'U'))
Begin
	Create Table ScheduleParameter
	(
		ScheduleParameterId Int Identity Constraint PK_ScheduleParam Primary Key,
		ScheduleId Int Not Null Constraint DF_ScheduleParam_ScheduleId Default 0,
		Name nVarchar(50) Not Null Constraint DF_ScheduleParam_Name Default '',
		Value nVarchar(200) Not Null Constraint DF_ScheduleParam_Value Default '',
		Constraint FK_Param_Schedule Foreign Key (ScheduleId) References Schedule (ScheduleId)
	)
End
