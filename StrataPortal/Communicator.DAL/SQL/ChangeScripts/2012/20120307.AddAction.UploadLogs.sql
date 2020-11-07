If (Not Exists(Select * From rmh.RockendAction Where ActionName = 'UploadLogs'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, Namespace) Values ('UploadLogs', 'Rockend.REST.Processor.UploadLogs5', 'Upload', '')
End


If (Not Exists(Select * From rmh.RockendAction Where ActionName = 'ClearLogs'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, Namespace) Values ('ClearLogs', 'Rockend.REST.Processor.ClearLogs', 'ClearLog', '')
End


