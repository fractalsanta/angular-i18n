IF  Not EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[StaticSchedule]') AND type in (N'U'))
Begin
	Create Table StaticSchedule 
	(
		StaticScheduleId Int Identity Constraint PK_StaticSchedule Primary Key,
		ApplicationCode nVarchar(5) Not Null Constraint DF_StaticSchedule_AppCode Default '',
		ActionName nVarchar(50) Not Null Constraint DF_StaticSchedule_ActionName Default '',
		RunTime DateTime Null,
		DelayQuantity Int Not Null Constraint DF_StaticSchedule_DelayQ Default 0,
		DelayType nVarchar(6) Not Null Constraint DF_StaticSchedule_DelayType Default '',
		Hidden Bit Not Null Constraint DF_StaticSchedule_Hidden Default 1
	)
End
