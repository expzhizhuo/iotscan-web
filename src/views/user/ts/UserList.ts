export const UserList_tableColumn: Table.Column[] = [
    {prop: 'username', label: '用户名', sortable: true, showOverflowTooltip: true},
    {prop: 'phone', label: '手机号', showOverflowTooltip: true},
    {prop: 'permissions', label: '权限', sortable: true, slot: 'permissions'},
    {prop: 'last_login_ip', label: '最后一次登陆ip', showOverflowTooltip: true},
    {prop: 'last_login', label: '最后一次登陆时间', width: '180px'},
    {type: 'date', prop: 'create_time', label: '创建时间', width: '180px'},
    {
        width: '140',
        label: '操作',
        buttons: [
            {name: '删除', type: 'danger', icon: 'Delete', command: 'delete'}
        ]
    }
]