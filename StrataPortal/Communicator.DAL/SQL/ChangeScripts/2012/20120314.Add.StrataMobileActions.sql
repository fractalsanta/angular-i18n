if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileLogin'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileLogin', 'Rockend.Strata.Processor.Mobile', 'Login')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileCorporateSearch'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileCorporateSearch', 'Rockend.Strata.Processor.Mobile', 'SearchCorporate')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileGetCommittee'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileGetCommittee', 'Rockend.Strata.Processor.Mobile', 'GetCommitteeMembers')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileGetOwners'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileGetOwners', 'Rockend.Strata.Processor.Mobile', 'GetOwners')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileGetTenants'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileGetTenants', 'Rockend.Strata.Processor.Mobile', 'GetTenants')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileGetTradespeople'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileGetTradespeople', 'Rockend.Strata.Processor.Mobile', 'GetTrades')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileCommitteeSearch'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileCommitteeSearch', 'Rockend.Strata.Processor.Mobile', 'SearchCommittee')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileOwnerSearch'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileOwnerSearch', 'Rockend.Strata.Processor.Mobile', 'SearchOwner')
End

if (Not Exists(Select * From rmh.RockendAction Where ActionName = 'StrataMobileCreditorSearch'))
Begin
	Insert rmh.RockendAction (ActionName, AssemblyName, ClassName) Values ('StrataMobileCreditorSearch', 'Rockend.Strata.Processor.Mobile', 'SearchTrade')
End
