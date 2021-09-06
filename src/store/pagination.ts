import { Ref, ref } from 'vue'
import { Pagination } from '@/models/pagination.model'
import { TasksGetFromDatabaseInfo } from '@/models/tasks.model'
import { listItemsCount } from './global';

const paginationStore: Ref<Pagination[]> = ref([])
const showItems = 5;

export default function usePagination() {
    const setPagination = (num: number) => {
        let endPage;
        const maxPage = (Number(sessionStorage.getItem('maxPage')) + (listItemsCount - Number(sessionStorage.getItem('maxPage')) % listItemsCount)) / listItemsCount;

        paginationStore.value = [];

        if (num < 1) num = 1;

        const startPage = Math.floor((num - 1) / showItems) * showItems;

        endPage = startPage + showItems;
        endPage > maxPage ? endPage = maxPage : null;

        paginationStore.value.push({ title: '<<', page: 1, active: false })
        let n = num;
        if (n - 1 < 1) n = 2;
        paginationStore.value.push({ title: '<', page: n - 1, active: false })


        for (let index = startPage + 1; index <= endPage; index++) {
            num === index ? paginationStore.value.push({ title: index.toString(), page: index, active: true }) :
                paginationStore.value.push({ title: index.toString(), page: index, active: false })
        }
        if (num + 1 > maxPage) num = maxPage - 1;
        paginationStore.value.push({ title: '>', page: num + 1, active: false });
        paginationStore.value.push({ title: '>>', page: maxPage, active: false });
    }

    return {
        setPagination,
        paginationStore,
    }
}