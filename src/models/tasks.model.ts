export type TasksGetFromDatabaseInfo = {
    tasks: [
        {
            id: string,
            addedTime: string,
            title: string,
            description: string,
            budget: {
                value: 0,
                currency: string
            },
            proposalCount: 0,
            platforms: string[],
            proposalAlreadySent: true,
            addedByMe: true,
            hasContractCreated: true,
            hasContractAccepted: true,
            files: [
                {
                    id: string,
                    filename: string,
                    size: 0,
                    signedUrl: string
                }
            ]
        }
    ],
    count: 0
}

export type TasksSearchParam = {
    limit: number;
    platforms: string[] | null;
    keywords: string[] | null;
    budgetGreaterEqual: number | null;
    budgetLowerEqual: number | null;
    olderThanId: string | null;
    newerThanId: string | null;
    skip: number;
}

export type ListItem = {
    title: string,
    description: string,
    budget: {
        value: number,
        currency: string
    },
    proposalCount: number,
    platforms: string[
    ],
    addedTime: string
}

export type TasksShowData = {
    [key: number]: ListItem[]
}