CREATE TABLE [Core].[Account] (
    [AccountId]    INT              IDENTITY (1, 1) NOT NULL,
    [FirstName]     NVARCHAR (50)   NOT NULL,
    [LastName]      NVARCHAR (50)   NOT NULL,
    [EmailAddress] NVARCHAR (100)   NOT NULL,
	[Password]	   NVARCHAR (50)    NOT NULL,
	[IsDeleted]     BIT             CONSTRAINT [DF_Account_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedDate]  DATETIME         CONSTRAINT [DF_Account_CreatedDate] DEFAULT (getdate()) NOT NULL,
    [ModifiedDate] DATETIME         NULL,
    [Row_Guid]     UNIQUEIDENTIFIER CONSTRAINT [DF_Account_Row_Guid] DEFAULT (newid()) NOT NULL,
    CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED ([AccountId] ASC)
);



