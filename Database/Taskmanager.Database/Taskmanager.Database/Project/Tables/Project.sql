CREATE TABLE [Project].[Project] (
    [ProjectId]    INT              IDENTITY (1, 1) NOT NULL,
    [Name]         NVARCHAR (50)    NOT NULL,
    [Description]  NVARCHAR (MAX)   NULL,
    [IsActive]     BIT              CONSTRAINT [DF_Project_IsActive] DEFAULT ((0)) NOT NULL,
	[IsDeleted]     BIT             CONSTRAINT [DF_Project_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedDate]  DATETIME         CONSTRAINT [DF_Project_CreatedDate] DEFAULT (getdate()) NOT NULL,
    [ModifiedDate] DATETIME         NULL,
    [Row_Guid]     UNIQUEIDENTIFIER CONSTRAINT [DF_Project_Row_Guid] DEFAULT (newid()) NOT NULL,
    CONSTRAINT [PK_Project] PRIMARY KEY CLUSTERED ([ProjectId] ASC)
);



