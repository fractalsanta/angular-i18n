If Not Exists(Select * From rmh.RockendAction Where ActionName = 'CopyRESTFile')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, [Namespace]) 
	Values ('CopyRESTFile', 'Rockend.REST.Processor.CopyToApplication', 'ApplicationCopy', 'Rockend.REST.Processor.CopyToApplication')
End
