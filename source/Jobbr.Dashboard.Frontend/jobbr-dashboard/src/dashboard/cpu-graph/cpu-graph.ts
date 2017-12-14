import { autoinject } from "aurelia-framework";
import { SmoothieChart, TimeSeries } from "smoothie";
import { ApiClient } from "resources/services/api-client";

@autoinject()
export class CpuGraphCustomElement {

  private apiClient: ApiClient;

  constructor(private element: Element) {
    this.apiClient = new ApiClient();
  }

  attached() {
    let smoothie = new SmoothieChart({
      grid: {
        strokeStyle: '#39434f', 
        fillStyle: '#22252B',
        lineWidth: 1,
        millisPerLine: 250, 
        verticalSections: 5,
      },
      labels: { fillStyle: '#ffc533' },
      interpolation: 'step',
      minValue: 0,
      maxValue: 100,
      limitFPS: 60
    });

    let canvas = <HTMLCanvasElement>document.getElementById("cpu-canvas");

    smoothie.streamTo(canvas, 250);

    var line = new TimeSeries();

    setInterval(() => {
      this.apiClient.getCpuInfo().then(data => {
        line.append(new Date().getTime(), data);
      });
    }, 250);

    smoothie.addTimeSeries(line, { 
      strokeStyle: 'rgb(0, 255, 0)',
      fillStyle: 'rgba(0, 255, 0, 0.1)', 
      lineWidth: 1 });
  }
}
