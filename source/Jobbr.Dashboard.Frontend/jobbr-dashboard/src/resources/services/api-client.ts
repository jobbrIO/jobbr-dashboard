import { autoinject } from "aurelia-framework";
import { HttpClient } from 'aurelia-fetch-client';


@autoinject
export class ApiClient {

  private httpClient: HttpClient;

  constructor() {
  }

  getCpuInfo(): Promise<any> {
    let httpClient = new HttpClient();

    httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withBaseUrl('http://localhost:1338/dashboard/');
    });

    return httpClient.fetch('system/cpu').then(response => response.json());
  }

  getMemoryInfo(): Promise<any> {
    let httpClient = new HttpClient();

    httpClient.configure(config => {
      config
        .useStandardConfiguration()
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withBaseUrl('http://localhost:1338/dashboard/');
    });

    return httpClient.fetch('system/memory').then(response => response.json());
  }
}
