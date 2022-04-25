import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            collapsed: false,
            showLoadPap: false,
            isCreatingNewMap: false
        }
    },
})
