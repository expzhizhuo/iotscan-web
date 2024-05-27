import {h} from 'vue'
import {ElInput, ElMessage} from "element-plus";
import useClipboard from "vue-clipboard3";
import {CopyDocument} from "@element-plus/icons-vue";

const {toClipboard} = useClipboard()
// 基本表格配置
export const tableColumn: Table.Column[] = [
    {type: 'selection', width: '50'},
    {type: 'index', width: '50', label: 'No.'},
    {prop: 'name', label: '名字', sortable: true},
    {prop: 'test', label: 'test'},
    {type: 'date', prop: 'date', label: '日期'},
    {prop: 'address', label: '地址', slot: 'address', showOverflowTooltip: true},
    {
        width: '240',
        label: '操作',
        buttons: [
            {name: '编辑', type: 'primary', icon: 'Edit', command: 'edit'},
            {name: '删除', type: 'danger', icon: 'Edit', command: 'delete'}
        ]
    }
]

interface User {
    date: number
    name: string
    address: string
}

const renderExpandContent = (row: User) =>
    h('div', {style: 'margin-left: 50px;margin-right: 50px;'}, [
        h('p', `名字：${row.name}`),
        h('p', `地址：${row.address}`),
        h('p', `日期：${row.date}`),
        h('div', {
            style: 'display: flex;'
        }, [
            h('div', {style: 'flex: 1; position: relative; margin-right: 25px;'}, [
                h(ElInput, {
                    type: 'textarea',
                    rows: 16,
                    modelValue: row.date,
                    readonly: true,
                }),
                h(CopyDocument, {
                    style: 'position: absolute; top: 10px; right:25px;float: right;  border: 1px padding: 1px;width:15px;height:15px',
                    onClick: async () => {
                        await toClipboard(String(row.date))
                        ElMessage.success("复制成功")
                    }
                })
            ]),
            h('div', {style: 'flex: 1; position: relative; margin-left: 25px;'}, [
                h(ElInput, {
                    type: 'textarea',
                    rows: 16,
                    modelValue: row.address,
                    readonly: true,
                }),
                h(CopyDocument, {
                    style: 'position: absolute; top: 10px; right:25px;float: right;  border: 1px padding: 1px;width:15px;height:15px',
                    onClick: async () => {
                        console.log(row.address)
                        await toClipboard(row.address)
                        ElMessage.success("复制成功")
                    }
                })
            ])
        ])
    ])


// 带有分页的表格配置
export const tableDemoColumn: Table.Column[] = [
    {type: 'expand', width: '50', render: ({row}) => renderExpandContent(row)},
    {type: 'index', width: '65', label: 'No.', align: 'center'},
    {prop: 'avatar', label: '头像', width: '100', align: 'center'},
    {prop: 'address', label: '地址', slot: 'address', showOverflowTooltip: true, width: '180px'},
    {prop: 'name', label: '姓名', width: '100'},
    {prop: 'age', label: '年龄', width: '90', align: 'center'},
    {prop: 'gender', label: '性别', width: '90', slot: 'gender', align: 'center'},
    {prop: 'mobile', label: '手机号', width: '180'},
    {prop: 'email', label: '邮箱', showOverflowTooltip: true},
    {
        width: '220',
        label: '操作',
        buttons: [
            {name: '编辑', type: 'success', command: 'edit', icon: 'Edit'},
            {name: '删除', type: 'danger', command: 'delete', icon: 'Delete'}
        ]
    }
]
