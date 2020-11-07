
/****** Object:  Schema [rmh]    Script Date: 08/10/2011 10:34:37 ******/
IF EXISTS (SELECT * FROM sys.schemas WHERE name = N'rmh')
	PRINT 'Schema [rmh] already exists...(CREATE SCHEMA must be first statment in a query batch)'
GO

CREATE SCHEMA [rmh] AUTHORIZATION [dbo]
GO


