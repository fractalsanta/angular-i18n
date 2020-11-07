If Not Exists (Select * From rmh.RockendAction Where ActionName = 'RefreshSQL')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, Namespace) Values ('RefreshSQL', 'Rockend.REST.Processor.SQLData', 'SqlRefresh', '')
End
