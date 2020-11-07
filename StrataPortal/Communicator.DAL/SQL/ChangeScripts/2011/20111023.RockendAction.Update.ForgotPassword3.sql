UPDATE rmh.RockendAction 
SET AssemblyName = 'Rockend.REST.Processor.ForgotPassword3'
WHERE ActionName in ( 'FindUsername' , 'FindEmail' )

-- select * from rmh.RockendAction
