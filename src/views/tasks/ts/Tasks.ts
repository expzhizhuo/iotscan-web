export const Tasks_tableColumn: Table.Column[] = [
    {prop: 'desc', label: '任务描述', showOverflowTooltip: true},
    {prop: 'status', label: '任务状态', slot: "status", sortable: true, showOverflowTooltip: true},
    {prop: 'poc_type', label: 'POC类型', slot: 'poc_type', sortable: true, showOverflowTooltip: true},
    {
        prop: 'scanning_speed',
        label: '扫描速度',
        width: '100px',
        slot: 'scanning_speed',
        showOverflowTooltip: true
    },
    {prop: 'progress', label: '扫描进度', slot: 'progress', sortable: true, showOverflowTooltip: true},
    {prop: 'create_user', label: '创建用户', slot: "create_user"},
    {prop: 'create_time', label: '创建时间', showOverflowTooltip: true},
    {
        width: '240',
        label: '操作',
        buttons: [],
        slot: 'action'
    }
]