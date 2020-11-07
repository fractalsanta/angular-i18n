If Not Exists (Select * From StaticSchedule Where ApplicationCode = 'RP' And ActionName = 'RefreshSQL')
Begin
	Insert StaticSchedule (ApplicationCode, ActionName, RunTime, DelayQuantity, DelayType, Hidden)
	Values ('RP', 'RefreshSQL', '1900-01-01 22:00:00.000', 1, 'day', 1)
End
