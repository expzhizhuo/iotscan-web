// noinspection TypeScriptValidateTypes

import {defineStore} from "pinia"

interface ObjectList {
    [key: string]: string[];
}

export const usePermissStore = defineStore("permiss", {
    state: () => {
        return {
            key: <string[]>[],
            defaultList: <ObjectList>{
                admin: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
                user: ["1", "2", "3", "11", "13", "14", "15"]
            }
        }
    },

    actions: {
        handleSet(val: string[]) {
            this.key = val
        },
        clear() {
            this.key = []
        }
    },
    persist: {
        storage: localStorage,
        paths: ["key"],
    }
})