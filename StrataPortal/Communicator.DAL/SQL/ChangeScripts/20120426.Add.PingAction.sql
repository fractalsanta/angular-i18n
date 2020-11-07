If Not Exists (select * from rmh.RockendAction Where ActionName = 'Ping')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('Ping', 'Rockend.Processor.Ping', 'Ping')
End