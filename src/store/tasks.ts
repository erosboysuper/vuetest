import { Ref, ref } from 'vue'
import {
    TasksGetFromDatabaseInfo,
    TasksShowData,
    TasksSearchParam,
    ListItem
} from '@/models/tasks.model'

import { listItemsCount } from './global';

const tasksList: Ref<TasksShowData> = ref([])
const showListDataBuffer: Ref<ListItem[]> = ref([]);
const showListData: Ref<ListItem[]> = ref([]);

export default function useTasksStore() {
    const setTasksList = (datas: TasksGetFromDatabaseInfo | string, pageInfo: TasksSearchParam | number, currentPage: number) => {
        let buffer: ListItem[] = [];
        console.log(currentPage, "currentpage");

        if (typeof datas === 'object') {
            // let currentPage: number;
            // typeof pageInfo === 'number' ? currentPage = pageInfo : currentPage = pageInfo.skip;

            let count = 0;
            datas.tasks.map((data, id) => {
                if (id === listItemsCount) {
                    tasksList.value[currentPage] = buffer;
                    buffer = [];
                }

                buffer.push({
                    title: data.title,
                    description: data.description,
                    budget: data.budget,
                    proposalCount: data.proposalCount,
                    platforms: data.platforms,
                    addedTime: data.addedTime
                })
                count = id;
                return true;
            })
            if (count + 1 > listItemsCount) tasksList.value[currentPage + 1] = buffer;
            showListDataBuffer.value = tasksList.value[currentPage];
            sessionStorage.setItem(`currentPage`, currentPage.toString());
        } else {
            let currentPage: number;
            typeof pageInfo === 'number' ? currentPage = pageInfo : currentPage = pageInfo.skip;

            showListDataBuffer.value = tasksList.value[currentPage];

            sessionStorage.setItem(`currentPage`, currentPage.toString());
        }

        showListData.value = [];

        showListDataBuffer.value.map((data) => {
            const currentTime = new Date();
            const oldTime = new Date(data.addedTime);
            let addedTime = '';
            if (currentTime.getFullYear() - oldTime.getFullYear() > 0) {
                addedTime = (currentTime.getFullYear() - oldTime.getFullYear()) + 'years ago';
            } else if (currentTime.getMonth() - oldTime.getMonth() > 0) {
                addedTime = (currentTime.getMonth() - oldTime.getMonth()) + 'months ago';
            } else if (currentTime.getDate() - oldTime.getDate() > 0) {
                addedTime = (currentTime.getDate() - oldTime.getDate()) + 'days ago';
            } else if (currentTime.getHours() - oldTime.getHours() > 0) {
                addedTime = (currentTime.getHours() - oldTime.getHours()) + 'hours ago';
            } else {
                addedTime = (currentTime.getMinutes() - oldTime.getMinutes()) + 'mins ago';
            }
            showListData.value.push({ ...data, addedTime })
        })
    }

    const getLists = () => {
        return tasksList.value;
    }
    const reset = () => {
        sessionStorage.setItem(`page`, `1`);
        showListDataBuffer.value = [];
        tasksList.value = [];
        showListData.value = [];
    }

    return {
        setTasksList,
        tasksList,
        showListData,
        getLists,
        reset,
    }
}
