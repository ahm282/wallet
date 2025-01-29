import axios from "axios";

interface ApiUtilProps {
    apiEndpoint: string;
}

export default class ApiUtil implements ApiUtilProps {
    apiEndpoint: string;

    constructor(apiEndpoint: string) {
        this.apiEndpoint = apiEndpoint;
    }

    getConfig(token?: string) {
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    }

    get() {
        return axios.get(this.apiEndpoint);
    }

    getById(id: string) {
        return axios.get(`${this.apiEndpoint}/${id}`);
    }

    post(data: any, token?: string) {
        return axios.post(this.apiEndpoint, data, this.getConfig(token));
    }

    delete(id: string, token?: string) {
        return axios.delete(`${this.apiEndpoint}/${id}`, this.getConfig(token));
    }
}
