declare @id int

select * from sysobjects where name = 'BankAccount'
select @id = id from sysobjects where name = 'BankAccount'
PRINT @id
select * from syscolumns where id = @id

-- grab this content and throw it into a class  :-)
select '
        [Column(Name = "' + name + '")]
        public '+  case when xtype in (167,175 ) THEN 'string' when xtype = 56 then 'int' ELSE 'xxx' end  
		+' ' + RIGHT(name, LEN(name) - 1) + ' { get; set; }' 
from syscolumns where id = @id

