import { autoinject } from "aurelia-framework";
import { SmoothieChart, TimeSeries } from "smoothie";
import { ApiClient } from "resources/services/api-client";

@autoinject()
export class MemoryGraphCustomElement {

  private apiClient: ApiClient;

  private smoothie: SmoothieChart;
  private timeoutId;

  constructor(private element: Element) {
    this.apiClient = new ApiClient();
  }

  attached() {
    this.apiClient.getMemoryInfo().then(data => {
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
        maxValue: data.totalPhysicalMemory,
        limitFPS: 60,
      });

      let canvas = <HTMLCanvasElement>document.getElementById("memory-canvas");

      this.smoothie.streamTo(canvas, 1000);

      var line = new TimeSeries();

      this.timeoutId = setInterval(() => {
        this.apiClient.getMemoryInfo().then(data => {
          line.append(new Date().getTime(), data.freeMemory);
        });
      }, 1000);

      this.smoothie.addTimeSeries(line, {
        strokeStyle: 'rgb(38, 108, 179)',
        fillStyle: 'rgba(38, 108, 179, 0.1)',
        lineWidth: 1
      });
    });
  }

  detached() {
    clearTimeout(this.timeoutId);
    this.smoothie.stop();
  }
}
