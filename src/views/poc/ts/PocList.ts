export const PocList_tableColumn: Table.Column[] = [
    {prop: 'poc_name', label: '漏洞名称', showOverflowTooltip: true},
    {prop: 'vul_desc', label: '漏洞描述', showOverflowTooltip: true},
    {prop: 'vul_author', label: '作者', showOverflowTooltip: true},
    {prop: 'vul_leakLevel', label: '漏洞等级', slot: 'vul_leakLevel', sortable: true, width: '120px'},
    {prop: 'vul_name', label: '影响产品', showOverflowTooltip: true},
    {prop: 'vul_range', label: '影响版本', showOverflowTooltip: true},
    {prop: 'has_exp', label: '有无EXP', slot: 'has_exp', width: '80px'},
    {prop: 'vul_vulDate', label: '公布日期',},
    {type: 'date', prop: 'vul_createDate', label: '编写日期',},
    {
        width: '180',
        label: '操作',
        buttons: [],
        slot: 'action'
    }
]