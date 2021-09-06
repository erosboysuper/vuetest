import api from '@/services/api'
import useTasksStore from '@/store/tasks'
import usePagination from '@/store/pagination'
import { listItemsCount } from '@/store/global'
import { TasksSearchParam, TasksGetFromDatabaseInfo } from '@/models/tasks.model'


const { setTasksList, getLists, reset } = useTasksStore();
const { setPagination } = usePagination();

const getTasksList = async (data: TasksSearchParam | number) => {
    let query = 'tasks?', skip = 0, maxPage = 0, first = 0;
    maxPage = Number(sessionStorage.getItem('maxPage'));

    if (typeof data === 'number') {
        data === 0 ? skip = data * listItemsCount : skip = (data - 1) * listItemsCount;

        if (maxPage < skip) skip = maxPage - maxPage % listItemsCount

        query += `limit=6&skip=${skip}`;
    } else {
        first = data.skip;

        const buffer = getLists();
        if (Object.keys(buffer).filter(item => Number(item) === data.skip).length > 0) {
            query += 'limit=3';
            skip = (data.skip) * listItemsCount;
        } else {
            query += 'limit=6';
            skip = (data.skip - 1) * listItemsCount;
        }
        if (maxPage < skip) skip = maxPage - maxPage % listItemsCount
        query += `&skip=${skip}`;

        if (
            Object.keys(buffer).filter(item => Number(item) === data.skip).length > 0 &&
            Object.keys(buffer).filter(item => Number(item) === data.skip + 1).length > 0) {
            setPagination(data.skip);
            setTasksList('', data, data.skip);
            return data;
        }
        if (data.budgetGreaterEqual) query += `&budgetGreaterEqual=${data.budgetGreaterEqual}`;
        if (data.budgetLowerEqual) query += `&budgetLowerEqual=${data.budgetLowerEqual}`;
        if (data.newerThanId) query += `&newerThanId=${data.newerThanId}`;
        if (data.olderThanId) query += `&olderThanId=${data.olderThanId}`;
        data.keywords?.map((item) => {
            query += `&keywords[]=${item}`
            return true;
        })
        data.platforms?.map((item) => {
            query += `&platforms[]=${item}`;
            return true;
        })
    }

    console.log(query, skip, 'query');

    return await api.get<TasksGetFromDatabaseInfo>(query)
        .then((response) => {
            sessionStorage.setItem('maxPage', (response.data.count + skip).toString());
            if (typeof data === 'number') {
                setPagination(data);
                setTasksList(response.data, data, data);
            }
            else {
                setPagination(data.skip);
                data.skip ++;
                console.log(data.skip, "current control")
                setTasksList(response.data, data, first);
            }
            console.log(query, response.data, sessionStorage.getItem('maxPage'), "jong test");
            return response
        }).catch((error) => {
            console.log(error)
            return;
        })
}

const search = async (data: TasksSearchParam) => {
    reset();
    getTasksList(data);
}

export default function tasksListController() {
    return {
        getTasksList,
        search,
    }
}
