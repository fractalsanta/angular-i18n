if Not Exists(Select * From rmh.RockendAction Where ActionName = 'DelayFor')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, Namespace)
	Values ('DelayFor', 'Rockend.Processor.DelayTest', 'DelayFor', '')
End
