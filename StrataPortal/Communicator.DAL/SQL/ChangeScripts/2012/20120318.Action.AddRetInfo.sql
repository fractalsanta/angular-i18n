if Not Exists(Select * From rmh.RockendAction Where ActionName = 'RestInformation')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, Namespace)
	Values ('RestInformation', 'Rockend.REST.Processor.RestSystemInfo', 'RestInformation', '')
End
