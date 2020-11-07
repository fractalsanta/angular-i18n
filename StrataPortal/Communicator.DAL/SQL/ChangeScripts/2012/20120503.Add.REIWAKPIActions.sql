If Not Exists (Select * From rmh.RockendAction Where ActionName = 'WebAdvertising')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, Namespace) Values ('WebAdvertising', 'Rockend.REST.Processor.WebAdvertising', 'WebAdvertising', '')
End

If Not Exists (Select * From rmh.RockendAction Where ActionName = 'Kpi')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, Namespace) Values ('Kpi', 'Rockend.REST.Processor.RestKPI', 'GenerateKPI', '')
End

If Not Exists (Select * From rmh.RockendAction Where ActionName = 'reiwa')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('reiwa', 'Rockend.REST.Processor.ExportREIWA', 'ExportREIWA')
End