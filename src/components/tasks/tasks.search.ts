import { reactive } from 'vue'
import { listItemsCount } from '@/store/global';
import tasksListController from '@/middleware/controllers/tasksListController';
import { TasksSearchParam } from '@/models/tasks.model';


export default function useTasks() {
    const tasksList = tasksListController();

    const listQuery = reactive<TasksSearchParam>({
        limit: 3,
        platforms: [],
        keywords: [],
        budgetGreaterEqual: 0,
        budgetLowerEqual: 0,
        olderThanId: '',
        newerThanId: '',
        skip: 0
    })

    const getLists = (skip: number) => {
        listQuery.skip = skip;
        tasksList.getTasksList(listQuery);
    }

    const init = () => {
        tasksList.getTasksList(Number(sessionStorage.getItem("currentPage")));

        setInterval(() => {
            tasksList.getTasksList(Number(sessionStorage.getItem("currentPage")));
        }, 60000);
    }

    const search = () => {
        tasksList.search(listQuery);
    }

    return {
        getLists,
        listQuery,
        init,
        search
    }
}
