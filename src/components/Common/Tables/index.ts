import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import {type TableInstance} from 'element-plus'

type SortParams<T = any> = {
    column: TableColumnCtx<T>
    order: any
    prop: string
}
/**
 *  获取 element 的事件类型
 *  type ElTableEmitsType = TableInstance['$emit']
 *  type EmitsEvent = { (event: Event, ...args: any[]): void } & ElTableEmitsType
 *  但是 vite 加载失败，无法解析 报错如下
 *  [@vue/compiler-sfc] Unresolvable type reference or unsupported built-in utility type
 *  暂时没找到更好的解决办法
 *  所以，暂时先手动定义 element  表格的事件类型
 */
// element table 的事件
const elementEvents = [
    'select',
    'select-all',
    'selection-change',
    'cell-mouse-enter',
    'cell-mouse-leave',
    'cell-contextmenu',
    'cell-click',
    'cell-dblclick',
    'row-click',
    'row-contextmenu',
    'row-dblclick',
    'header-click',
    'header-contextmenu',
    'sort-change',
    'filter-change',
    'current-change',
    'header-dragend',
    'expand-change'
] as const
type ElTableEmitsType = (typeof elementEvents)[number]
type Event =
    | 'command'
    | 'size-change'
    | 'current-change'
    | 'pagination-change'
    | 'search'
    | 'refresh'
    | 'edit-cancel'
    | 'edit-end'
    | ElTableEmitsType

type EmitsEvent = (event: Event, ...args: any[]) => void
export type {SortParams, EmitsEvent, TableInstance}
