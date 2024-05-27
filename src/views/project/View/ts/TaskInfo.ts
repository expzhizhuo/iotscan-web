import {h} from "vue";
import {ElInput, ElMessage} from "element-plus";
import {CopyDocument} from "@element-plus/icons-vue";
import useClipboard from "vue-clipboard3";

const {toClipboard} = useClipboard()

interface User {
    date: number
    poc_name: string
    vul_desc: string
    vul_vulDate: string
}

const renderExpandContent = (row: User) =>
    h('div', {style: 'margin-left: 50px;margin-right: 50px;'}, [
        h('p', `漏洞名称：${row.poc_name}`),
        h('p', `漏洞描述：${row.vul_desc}`),
        h('p', `日期：${row.vul_vulDate}`),
        h('div', {
            style: 'display: flex;'
        }, [
            h('div', {style: 'flex: 1; position: relative; margin-right: 25px;'}, [
                h(ElInput, {
                    type: 'textarea',
                    rows: 16,
                    modelValue: row.poc_name,
                    readonly: true,
                }),
                h(CopyDocument, {
                    style: 'position: absolute; top: 10px; right:25px;float: right;  border: 1px padding: 1px;width:15px;height:15px',
                    onClick: async () => {
                        await toClipboard(String(row.poc_name))
                        ElMessage.success("复制成功")
                    }
                })
            ]),
            h('div', {style: 'flex: 1; position: relative; margin-left: 25px;'}, [
                h(ElInput, {
                    type: 'textarea',
                    rows: 16,
                    modelValue: row.vul_desc,
                    readonly: true,
                }),
                h(CopyDocument, {
                    style: 'position: absolute; top: 10px; right:25px;float: right;  border: 1px padding: 1px;width:15px;height:15px',
                    onClick: async () => {
                        console.log(row.vul_desc)
                        await toClipboard(row.vul_desc)
                        ElMessage.success("复制成功")
                    }
                })
            ])
        ])
    ])

export const TaskReport_tableColumn: Table.Column[] = [
    {type: 'expand', width: '50', render: ({row}) => renderExpandContent(row)},
    {prop: 'poc_name', label: '漏洞名称', showOverflowTooltip: true},
    {prop: 'vul_desc', label: '漏洞描述', showOverflowTooltip: true},
    {prop: 'vul_author', label: '作者'},
    {prop: 'vul_leakLevel', label: '漏洞等级', sortable: true},
    {prop: 'vul_name', label: '影响产品', width: '100px'},
    {prop: 'vul_range', label: '影响版本', width: '100px'},
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