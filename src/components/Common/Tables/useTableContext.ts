import {provide, inject} from 'vue';
import type {EmitsEvent} from './index'

const key = Symbol('easy-table')

type Instance = {
    options: any
    emit: EmitsEvent;
};


export function createTableContext(instance: Instance) {
    provide(key, instance)
}

export function useTableContext(): Instance {
    return inject(key) as Instance
}
