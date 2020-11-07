If Not Exists (Select * From StaticSchedule Where ApplicationCode = 'RP' And ActionName = 'RefreshSQL')
Begin
	Insert StaticSchedule (ApplicationCode, ActionName, RunTime, DelayQuantity, DelayType) Values ('RP', 'RefreshSQL', '22:00:00', 1, 'day')
End
