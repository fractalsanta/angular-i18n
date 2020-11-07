If Not Exists (Select * From rmh.RockendAction Where ActionName = 'kpi')
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName, namespace) Values ('Kpi', 'Rockend.REST.Processor.RestKPI', 'GenerateKPI', '')
End


