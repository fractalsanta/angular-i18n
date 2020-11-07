IF  Not EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[StaticScheduleParameter]') AND type in (N'U'))
Begin
	Create Table StaticScheduleParameter
	(
		StaticScheduleParameterId Int Identity Constraint PK_StaticScheduleParam Primary Key,
		StaticScheduleId Int Not Null Constraint DF_StaticScheduleParam_Id Default 0,
		Name nVarchar(50) Not Null Constraint DF_StaticScheduleParam_Name Default '',
		Value nVarchar(200) Not Null Constraint DF_StaticScheduleParam_Value Default '',
		Constraint FK_Param_StaticSchedule Foreign Key (StaticScheduleId) References StaticSchedule (StaticScheduleId)
	)
End
