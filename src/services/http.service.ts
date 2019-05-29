import axios from 'axios'

class HttpService {
  /* */
  get<T> (relativeUrl: string, params?: any): Promise<T> {
    return axios.get(this.getUrl(relativeUrl), params ? { params } : undefined) as any
  }

  put<T> (relativeUrl: string, payload?: any): Promise<T> {
    return axios.put(this.getUrl(relativeUrl), payload) as any
  }

  post<T> (relativeUrl: string, payload?: any): Promise<T> {
    return axios.post(this.getUrl(relativeUrl), payload) as any
  }

  delete<T> (relativeUrl: string): Promise<T> {
    return axios.delete(this.getUrl(relativeUrl)) as any
  }

  public getUrl (relativeUrl: string): string {
    relativeUrl = this.removeLeadingSlash(relativeUrl)
    return `${process.env.VUE_APP_API_URL}/${relativeUrl}`
  }

  private removeLeadingSlash (url: string) {
    return url.charAt(0) === '/' ? url.substr(1) : url
  }
}

export const httpService = new HttpService()
