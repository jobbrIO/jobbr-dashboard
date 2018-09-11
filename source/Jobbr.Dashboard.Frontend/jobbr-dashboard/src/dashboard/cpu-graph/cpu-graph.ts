import { autoinject } from "aurelia-framework";
import { SmoothieChart, TimeSeries } from "smoothie";
import { ApiClient } from "resources/api/api-client";
import { clearInterval } from "timers";

@autoinject()
export class CpuGraphCustomElement {

  private apiClient: ApiClient;

  private smoothie: SmoothieChart;
  private timeoutId;

  constructor(private element: Element) {
    this.apiClient = new ApiClient();
  }

  attached() {
    this.smoothie = new SmoothieChart({
      grid: {
        strokeStyle: '#39434f', 
        fillStyle: '#22252B',
        lineWidth: 1,
        millisPerLine: 1000, 
        verticalSections: 5,
      },
      labels: { fillStyle: '#ffc533' },
      interpolation: 'step',
      minValue: 0,
      maxValue: 100,
      limitFPS: 60
    });

    let canvas = <HTMLCanvasElement>document.getElementById("cpu-canvas");

    this.smoothie.streamTo(canvas, 1000);
    
    var line = new TimeSeries();

    this.timeoutId = setInterval(() => {
      this.apiClient.getCpuInfo().then(data => {
        line.append(new Date().getTime(), data);
      });
    }, 1000);

    this.smoothie.addTimeSeries(line, { 
      strokeStyle: 'rgb(0, 255, 0)',
      fillStyle: 'rgba(0, 255, 0, 0.1)', 
      lineWidth: 1 });
  }

  detached() {
    clearTimeout(this.timeoutId);
    this.smoothie.stop();
  }
}
