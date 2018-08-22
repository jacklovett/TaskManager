CREATE TABLE [Task].[Task] (
    [TaskId]       INT              IDENTITY (1, 1) NOT NULL,
    [Project_Id]   INT              NOT NULL,
    [Assignee_Id]  INT              NULL,
    [Name]         NVARCHAR (50)    NOT NULL,
    [Description]  NVARCHAR (MAX)   NULL,
	[Comments]	   NVARCHAR (MAX)	NULL,
    [Deadline]     DATETIME         NULL,
	[InProgress]	BIT				NOT NULL DEFAULT ((0)),
	[IsTesting]		BIT				NOT NULL DEFAULT ((0)),
	[IsCompleted]	BIT				NOT NULL DEFAULT ((0)),
	[IsBacklog]		BIT				NOT NULL DEFAULT ((0)),
	[IsDeleted]     BIT             CONSTRAINT [DF_Task_IsDeleted] DEFAULT ((0)) NOT NULL,
	[CompletedDate] DATETIME         NULL,
    [CreatedDate]  DATETIME         CONSTRAINT [DF_Task_CreatedDate] DEFAULT (getdate()) NOT NULL,
    [ModifiedDate] DATETIME         NULL,
    [Row_Guid]     UNIQUEIDENTIFIER CONSTRAINT [DF_Task_Row_Guid] DEFAULT (newid()) NOT NULL,
    CONSTRAINT [PK_Task] PRIMARY KEY CLUSTERED ([TaskId] ASC)
);



