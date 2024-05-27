export const VulReport_tableColumn: Table.Column[] = [
    {prop: 'poc_info', label: '漏洞名称', slot: 'poc_info', showOverflowTooltip: true, width: '200'},
    {prop: 'vul_desc', label: '漏洞描述', slot: 'vul_desc', showOverflowTooltip: true},
    {prop: 'vul_leakLevel', label: '漏洞等级', slot: 'vul_leakLevel', sortable: true, width: '110'},
    {prop: 'vul_name', label: '影响产品', slot: 'vul_name', width: '100', showOverflowTooltip: true},
    {prop: 'vul_range', label: '影响版本', slot: 'vul_range', width: '100', sortable: true,},
    {prop: 'has_exp', label: '有无EXP', slot: 'has_exp', width: '80'},
    {prop: 'vul_vulDate', label: '公布日期', slot: 'vul_vulDate', width: '120'},
    {
        width: '180',
        label: '操作',
        buttons: [],
        slot: 'action'
    }
]