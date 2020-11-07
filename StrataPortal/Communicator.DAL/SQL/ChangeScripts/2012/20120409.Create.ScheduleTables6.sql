IF  Not EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Schedule]') AND type in (N'U'))
Begin
	Create Table Schedule
	(
		ScheduleId Int Identity Constraint PK_Schedule Primary Key,
		ServiceId Int Not Null Constraint DF_Schedule_ServiceKey Default 0,
		ApplicationKey Int Not Null Constraint DF_Schedule_ApplicationKey Default 0,
		ActionName nVarchar(50) Not Null Constraint DF_Schedule_ActionName Default '',
		StartAt DateTime Null,
		DelayQuantity Int Not Null Constraint DF_Schedule_DelayQ Default 0,
		DelayType nVarchar(6) Not Null Constraint DF_Schedule_DelayType Default '',
		LastRun DateTime Null,
		Hidden Bit Not Null Constraint DF_Schedule_Hidden Default 0
	)
End
