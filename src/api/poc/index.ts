import request from "@/utils/request";

export default {
    get_poc_list(data: { id: string, page: number, page_size: number }) {
        return request(
            {
                url: '/tools/poc_list',
                method: 'get',
                params: data,
            }
        )
    },
    get_poc_list_search(data: { keyword: string, page: number, page_size: number }) {
        return request(
            {
                url: '/tools/poc_list/search',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: 'post',
                data: data,
            }
        )
    },
    get_poc_init() {
        return request(
            {
                url: '/tools/poc_list',
                method: 'post',
            }
        )
    },
    delete_poc(data: { poc_id: string }) {
        return request({
            url: '/tools/poc_list/delete_poc',
            method: 'post',
            data: data
        })
    }
}