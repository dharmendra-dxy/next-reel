type FetchOption = {
    method? :"GET" | "POST" | "PUT",
    body? : any,
    headers?: Record<string,string>,
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOption = {},
    ): Promise<T>{

        const {method = "GET", body, headers={}} = options;

        const defaultHeader = {
            'Content-Type': 'application/json',
            ...headers,
        }

        const res = await fetch(`/api/${endpoint}`, {
            method,
            headers : defaultHeader,
            body: body ? JSON.stringify(body): undefined,
        });

        if(!res.ok){
            throw new Error(await res.text());
        }

        return res.json();
    }
}