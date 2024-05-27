import request from '@/utils/request'

export default {
    get_home_info() {
        return request(
            {
                url: '/home/list',
                method: 'get',
            }
        )
    },
    get_network_info() {
        return request(
            {
                url: '/home/list/get_device_network_speed',
                method: 'get',
            }
        )
    },
    get_device_network() {
        return request(
            {
                url: '/home/list/get_device_network',
                method: 'get',
            }
        )
    },
    get_device_status() {
        return request(
            {
                url: '/home/list/get_device_status',
                method: 'get',
            }
        )
    }
}